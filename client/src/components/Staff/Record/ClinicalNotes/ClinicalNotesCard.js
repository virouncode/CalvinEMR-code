import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import {
  postPatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import useSocketContext from "../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";
import {
  nowTZTimestamp,
  timestampToDateTimeSecondsStrTZ,
} from "../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/toPatientName";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import CalvinAI from "./CalvinAI/CalvinAI";
import ClinicalNotesAttachments from "./ClinicalNotesAttachments";
import ClinicalNotesCardBody from "./ClinicalNotesCardBody";
import ClinicalNotesCardHeader from "./ClinicalNotesCardHeader";
import ClinicalNotesCardHeaderFolded from "./ClinicalNotesCardHeaderFolded";

var _ = require("lodash");

const ClinicalNotesCard = ({
  clinicalNote,
  clinicalNotes,
  setClinicalNotes,
  patientId,
  checkedNotes,
  setCheckedNotes,
  setSelectAll,
  contentsVisible,
  demographicsInfos,
  lastItemRef = null,
  addVisible,
  order,
}) => {
  //hooks
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const bodyRef = useRef(null);
  const [editVisible, setEditVisible] = useState(false);
  const [tempFormDatas, setTempFormDatas] = useState(null);
  const [formDatas, setFormDatas] = useState(null);
  const [bodyVisible, setBodyVisible] = useState(true);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [choosenVersionNbr, setChoosenVersionNbr] = useState(
    clinicalNote.version_nbr
  );

  useEffect(() => {
    if (clinicalNote) {
      setFormDatas(clinicalNote);
      setTempFormDatas(clinicalNote);
    }
  }, [clinicalNote]);

  useEffect(() => {
    setBodyVisible(contentsVisible);
  }, [contentsVisible]);

  //HANDLERS
  const handleTriangleProgressClick = (e) => {
    setBodyVisible((v) => !v);
    bodyRef.current.classList.toggle(
      "clinical-notes__card-body-container--active"
    );
  };

  const handleCalvinAIClick = () => {
    if (!demographicsInfos.ai_consent) {
      alert("The patient didn't give his/her consent to use AI for his record");
      return;
    }
    setPopUpVisible((v) => !v);
  };

  const handleEditClick = (e) => {
    setEditVisible(true);
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTempFormDatas({ ...tempFormDatas, [name]: value });
  };

  const handleCancelClick = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to cancel ? Your changes won't be saved",
      })
    ) {
      setEditVisible(false);
    }
  };
  const handleSaveClick = async (e) => {
    if (
      (_.isEqual(tempFormDatas, formDatas) &&
        (await confirmAlert({
          content: "You didn't change anything to the note, save anyway ?",
        }))) ||
      !_.isEqual(tempFormDatas, formDatas)
    ) {
      //First post the former clinical note to the clinical notes log tbl
      const clinicalNoteLog = { ...formDatas }; //former version
      clinicalNoteLog.clinical_note_id = formDatas.id;
      clinicalNoteLog.version_nbr = clinicalNote.version_nbr;
      try {
        await postPatientRecord(
          "/clinical_notes_log",
          user.id,
          clinicalNoteLog
        );
        //then put the new clinical note version in the clinical note tbl
        const datasToPost = { ...tempFormDatas };
        datasToPost.version_nbr = clinicalNote.version_nbr + 1; //increment version
        datasToPost.attachments_ids = clinicalNote.attachments_ids.map(
          ({ attachment }) => attachment.id
        ); //format attachments_ids
        datasToPost.date_updated = nowTZTimestamp(); //we update the date_updated
        delete datasToPost.version;
        await putPatientRecord(
          `/clinical_notes/${clinicalNote.id}`,
          user.id,
          datasToPost,
          socket,
          "CLINICAL NOTES"
        );
        setChoosenVersionNbr(clinicalNote.version_nbr + 1);
        setEditVisible(false);
        toast.success("Clinical note saved successfully", { containerId: "A" });
      } catch (err) {
        toast.error(`Error: unable to save clinical note: ${err.message}`, {
          containerId: "A",
        });
      }
    }
  };

  const handleCheck = (e) => {
    const value = e.target.checked;
    let checkedNotesUpdated = [...checkedNotes];
    if (value) {
      if (checkedNotesUpdated.indexOf(clinicalNote.id) === -1) {
        checkedNotesUpdated.push(clinicalNote.id);
      }
    } else {
      if (checkedNotesUpdated.indexOf(clinicalNote.id) !== -1) {
        checkedNotesUpdated = checkedNotesUpdated.filter(
          (id) => id !== clinicalNote.id
        );
      }
    }
    setCheckedNotes(checkedNotesUpdated);
    if (checkedNotesUpdated.length === 0) {
      setSelectAll(false);
    } else if (checkedNotesUpdated.length === clinicalNotes.length) {
      setSelectAll(true);
    }
  };

  const handleVersionChange = async (e) => {
    const value = parseInt(e.target.value); //the choosen version
    setChoosenVersionNbr(value);

    //We setClinicalNotes because we can't set a single clinical note
    if (value < clinicalNote.version_nbr) {
      //we replace the actual clinical note by the version
      setClinicalNotes(
        clinicalNotes.map((item) =>
          item.id === clinicalNote.id
            ? {
                ...clinicalNote.versions.find(
                  ({ version_nbr }) => version_nbr === value
                ),
                id: clinicalNote.id,
                attachments_ids: clinicalNote.attachments_ids,
                versions: clinicalNote.versions,
              }
            : item
        )
      );
    } else {
      //back to last version
      const response = await xanoGet(
        `/clinical_notes/${clinicalNote.id}`,
        "staff"
      );
      setClinicalNotes(
        clinicalNotes.map((item) =>
          item.id === clinicalNote.id ? response.data : item
        )
      );
    }
  };

  const isChecked = (progressNoteId) => {
    return checkedNotes.includes(progressNoteId);
  };

  return (
    tempFormDatas && (
      <div className="clinical-notes__card" ref={lastItemRef}>
        {bodyVisible ? (
          <ClinicalNotesCardHeader
            demographicsInfos={demographicsInfos}
            isChecked={isChecked}
            handleCheck={handleCheck}
            clinicalNote={clinicalNote}
            tempFormDatas={tempFormDatas}
            editVisible={editVisible}
            versions={clinicalNote.versions}
            handleVersionChange={handleVersionChange}
            handleEditClick={handleEditClick}
            handleCalvinAIClick={handleCalvinAIClick}
            handleSaveClick={handleSaveClick}
            handleCancelClick={handleCancelClick}
            handleChange={handleChange}
            handleTriangleProgressClick={handleTriangleProgressClick}
            choosenVersionNbr={choosenVersionNbr}
          />
        ) : (
          <ClinicalNotesCardHeaderFolded
            tempFormDatas={tempFormDatas}
            handleTriangleProgressClick={handleTriangleProgressClick}
            isChecked={isChecked}
            clinicalNote={clinicalNote}
            handleCheck={handleCheck}
          />
        )}
        <div
          ref={bodyRef}
          className={
            bodyVisible
              ? "clinical-notes__card-body-container clinical-notes__card-body-container--active"
              : "clinical-notes__card-body-container"
          }
        >
          <ClinicalNotesCardBody
            tempFormDatas={tempFormDatas}
            editVisible={editVisible}
            handleChange={handleChange}
          />
          <ClinicalNotesAttachments
            attachments={clinicalNote.attachments_ids.map(
              ({ attachment }) => attachment
            )}
            deletable={false}
            patientId={patientId}
            date={clinicalNote.date_created}
          />
          {!editVisible && (
            <div className="clinical-notes__card-sign">
              <p style={{ padding: "0 10px" }}>
                Created by{" "}
                {staffIdToTitleAndName(staffInfos, clinicalNote.created_by_id)}{" "}
                on {timestampToDateTimeSecondsStrTZ(clinicalNote.date_created)}
              </p>
              {clinicalNote.date_updated && (
                <p style={{ padding: "0 10px" }}>
                  Updated on{" "}
                  {timestampToDateTimeSecondsStrTZ(clinicalNote.date_updated)}
                </p>
              )}
            </div>
          )}
        </div>
        {popUpVisible && (
          <FakeWindow
            title={`CALVIN AI talk about ${toPatientName(demographicsInfos)}`}
            width={1000}
            height={window.innerHeight}
            x={(window.innerWidth - 1000) / 2}
            y={0}
            color="#50B1C1"
            setPopUpVisible={setPopUpVisible}
          >
            <CalvinAI
              attachments={clinicalNote.attachments_ids.map(
                ({ attachment }) => attachment
              )}
              initialBody={formDatas.MyClinicalNotesContent}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
      </div>
    )
  );
};

export default ClinicalNotesCard;
