import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import {
  postPatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import useClinicalTemplatesSocket from "../../../../hooks/socket/useClinicalTemplatesSocket";
import useFetchDatas from "../../../../hooks/useFetchDatas";
import {
  nowTZTimestamp,
  timestampToDateTimeSecondsStrTZ,
} from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import CalvinAI from "./CalvinAI/CalvinAI";
import ClinicalNotesVersions from "./ClinicalNoteVersions";
import ClinicalNotesAttachments from "./ClinicalNotesAttachments";
import ClinicalNotesCardBody from "./ClinicalNotesCardBody";
import ClinicalNotesCardHeader from "./ClinicalNotesCardHeader";
import ClinicalNotesCardHeaderFolded from "./ClinicalNotesCardHeaderFolded";
import ClinicalNotesTemplates from "./ClinicalNotesTemplates";
var _ = require("lodash");

const ClinicalNotesCard = ({
  clinicalNote,
  clinicalNotes,
  patientId,
  checkedNotes,
  setCheckedNotes,
  setSelectAll,
  contentsVisible,
  demographicsInfos,
  lastItemRef = null,
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
  const [aiVisible, setAIVisible] = useState(false);
  const [versionsVisible, setVersionsVisible] = useState(false);
  const [choosenVersionNbr, setChoosenVersionNbr] = useState(
    clinicalNote.version_nbr
  );
  const [templatesVisible, setTemplatesVisible] = useState(false);

  const [templates, setTemplates] = useFetchDatas(
    "/clinical_notes_templates",
    "staff"
  );
  useClinicalTemplatesSocket(templates, setTemplates);

  const handleSelectTemplate = (e, templateId) => {
    e.stopPropagation();
    setTempFormDatas({
      ...tempFormDatas,
      MyClinicalNotesContent:
        tempFormDatas.MyClinicalNotesContent +
        (tempFormDatas.MyClinicalNotesContent ? "\n\n" : "") +
        templates.find(({ id }) => id === templateId)?.body,
    });
  };

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
  const handleTriangleClinicalClick = (e) => {
    e.stopPropagation();
    setBodyVisible((v) => !v);
    bodyRef.current.classList.toggle(
      "clinical-notes__card-body-container--active"
    );
  };

  const handleCalvinAIClick = (e) => {
    e.stopPropagation();
    if (!demographicsInfos.ai_consent) {
      alert("The patient didn't give his/her consent to use AI for his record");
      return;
    }
    setAIVisible((v) => !v);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditVisible(true);
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTempFormDatas({ ...tempFormDatas, [name]: value });
  };

  const handleCancelClick = async (e) => {
    e.stopPropagation();
    if (
      await confirmAlert({
        content: "Do you really want to cancel ? Your changes won't be saved",
      })
    ) {
      setEditVisible(false);
    }
  };
  const handleSaveClick = async (e) => {
    e.stopPropagation();
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

  const handleClickVersions = (e) => {
    e.stopPropagation();
    setVersionsVisible((v) => !v);
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
            setTemplatesVisible={setTemplatesVisible}
            editVisible={editVisible}
            versions={clinicalNote.versions}
            handleClickVersions={handleClickVersions}
            handleEditClick={handleEditClick}
            handleCalvinAIClick={handleCalvinAIClick}
            handleSaveClick={handleSaveClick}
            handleCancelClick={handleCancelClick}
            handleChange={handleChange}
            handleTriangleClinicalClick={handleTriangleClinicalClick}
            choosenVersionNbr={choosenVersionNbr}
          />
        ) : (
          <ClinicalNotesCardHeaderFolded
            tempFormDatas={tempFormDatas}
            handleTriangleClinicalClick={handleTriangleClinicalClick}
            handleClickVersions={handleClickVersions}
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
        {aiVisible && (
          <FakeWindow
            title={`CALVIN AI talk about ${toPatientName(demographicsInfos)}`}
            width={1000}
            height={window.innerHeight}
            x={(window.innerWidth - 1000) / 2}
            y={0}
            color="#93b5e9"
            setPopUpVisible={setAIVisible}
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
        {versionsVisible && (
          <FakeWindow
            title={`CLINICAL NOTE VERSIONS`}
            width={1000}
            height={600}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 600) / 2}
            color="#93b5e9"
            setPopUpVisible={setVersionsVisible}
          >
            <ClinicalNotesVersions
              versions={clinicalNote.versions}
              clinicalNote={clinicalNote}
            />
          </FakeWindow>
        )}
        {templatesVisible && (
          <FakeWindow
            title={`CHOOSE TEMPLATE(S)`}
            width={500}
            height={600}
            x={window.innerWidth - 500}
            y={0}
            color="#93b5e9"
            setPopUpVisible={setTemplatesVisible}
          >
            <ClinicalNotesTemplates
              templates={templates}
              handleSelectTemplate={handleSelectTemplate}
            />
          </FakeWindow>
        )}
      </div>
    )
  );
};

export default ClinicalNotesCard;
