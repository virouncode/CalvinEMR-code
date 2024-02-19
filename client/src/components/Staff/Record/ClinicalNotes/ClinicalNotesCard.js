import LinearProgress from "@mui/joy/LinearProgress";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  getPatientRecord,
  postPatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useFetchAttachmentsForClinicalNote from "../../../../hooks/useFetchAttachmentsForClinicalNote";
import useFetchVersions from "../../../../hooks/useFetchVersions";
import useSocketContext from "../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";
import useVersionsSocket from "../../../../hooks/useVersionsSocket";
import { toLocalDateAndTimeWithSeconds } from "../../../../utils/formatDates";
import {
  getLastUpdate,
  isUpdated,
} from "../../../../utils/socketHandlers/updates";
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
  allBodiesVisible,
  demographicsInfos,
  lastItemRef = null,
}) => {
  //hooks
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const bodyRef = useRef(null);
  const [editVisible, setEditVisible] = useState(false);
  const [tempFormDatas, setTempFormDatas] = useState(null);
  const [formDatas, setFormDatas] = useState(null);
  const [bodyVisible, setBodyVisible] = useState(true);
  const [popUpVisible, setPopUpVisible] = useState(false);

  const { versions, setVersions, versionsLoading } = useFetchVersions(
    patientId,
    clinicalNote.id
  );
  useVersionsSocket(versions, setVersions, clinicalNote.id);

  useEffect(() => {
    if (clinicalNote) {
      setFormDatas(clinicalNote);
      setTempFormDatas(clinicalNote);
    }
  }, [clinicalNote]);

  useEffect(() => {
    setBodyVisible(allBodiesVisible);
  }, [allBodiesVisible]);

  const { attachments, attachmentsLoading } =
    useFetchAttachmentsForClinicalNote(clinicalNote.attachments_ids);

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
      //First post the former clinical note version to the clinical note log tbl
      const logDatas = { ...formDatas };
      logDatas.clinical_note_id = formDatas.id;
      if (formDatas.version_nbr !== 1) {
        logDatas.updates = [
          {
            updated_by_id: getLastUpdate(formDatas).updated_by_id,
            date_updated: getLastUpdate(formDatas).date_updated,
          },
        ];
      }

      try {
        await postPatientRecord(
          "/clinical_notes_log",
          user.id,
          auth.authToken,
          logDatas
        );
        //then put the new clinical note version in the clinical note tbl
        tempFormDatas.version_nbr = clinicalNote.version_nbr + 1; //increment version
        await putPatientRecord(
          "/clinical_notes",
          clinicalNote.id,
          user.id,
          auth.authToken,
          tempFormDatas,
          socket,
          "CLINICAL NOTES"
        );
        setEditVisible(false);
        const versionsResults = (
          await getPatientRecord(
            "/clinical_notes_log_for_patient",
            patientId,
            auth.authToken
          )
        ).data.filter(
          ({ clinical_note_id }) => clinical_note_id === clinicalNote.id
        );

        versionsResults.forEach(
          (version) => (version.id = version.clinical_note_id)
        );
        versionsResults.sort((a, b) => a.version_nbr - b.version_nbr);
        socket.emit("message", {
          route: "VERSIONS",
          content: { data: versionsResults },
        });
        // setVersions(versionsResults);
        toast.success("Cli note saved successfully", { containerId: "A" });
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
    let updatedClinicalNotes = [...clinicalNotes];
    const index = _.findIndex(updatedClinicalNotes, {
      id: clinicalNote.id,
    });
    if (value < versions.length + 1) {
      //former version
      updatedClinicalNotes[index] = versions[value - 1];
    } else {
      //last version
      const response = await axiosXanoStaff.get(
        `/clinical_notes/${clinicalNote.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      updatedClinicalNotes[index] = response.data;
    }
    setClinicalNotes(updatedClinicalNotes);
  };

  const isChecked = (progressNoteId) => {
    return checkedNotes.includes(progressNoteId);
  };

  return tempFormDatas ? (
    <div className="clinical-notes__card" ref={lastItemRef}>
      {bodyVisible ? (
        <ClinicalNotesCardHeader
          demographicsInfos={demographicsInfos}
          isChecked={isChecked}
          handleCheck={handleCheck}
          clinicalNote={clinicalNote}
          tempFormDatas={tempFormDatas}
          editVisible={editVisible}
          versions={versions}
          versionsLoading={versionsLoading}
          handleVersionChange={handleVersionChange}
          handleEditClick={handleEditClick}
          handleCalvinAIClick={handleCalvinAIClick}
          handleSaveClick={handleSaveClick}
          handleCancelClick={handleCancelClick}
          handleChange={handleChange}
          handleTriangleProgressClick={handleTriangleProgressClick}
        />
      ) : (
        <ClinicalNotesCardHeaderFolded
          tempFormDatas={tempFormDatas}
          handleTriangleProgressClick={handleTriangleProgressClick}
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
          attachmentsLoading={attachmentsLoading}
          attachments={attachments}
          deletable={false}
          patientId={patientId}
          date={clinicalNote.date_created}
        />
        {!editVisible && (
          <div className="clinical-notes__card-sign">
            {isUpdated(tempFormDatas) ? (
              <p style={{ padding: "0 10px" }}>
                Updated by{" "}
                {staffIdToTitleAndName(
                  staffInfos,
                  getLastUpdate(tempFormDatas).updated_by_id,
                  true
                )}{" "}
                on{" "}
                {toLocalDateAndTimeWithSeconds(
                  getLastUpdate(tempFormDatas).date_updated
                )}
              </p>
            ) : null}
            <p style={{ padding: "0 10px" }}>
              Created by{" "}
              {staffIdToTitleAndName(
                staffInfos,
                tempFormDatas.created_by_id,
                true
              )}{" "}
              on {toLocalDateAndTimeWithSeconds(tempFormDatas.date_created)}
            </p>
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
            attachments={attachments}
            initialBody={formDatas.MyClinicalNotesContent}
            demographicsInfos={demographicsInfos}
          />
        </FakeWindow>
      )}
    </div>
  ) : (
    <LinearProgress
      thickness={0.5}
      style={{ margin: "10px" }}
      color="#cececd"
    />
  );
};

export default ClinicalNotesCard;
