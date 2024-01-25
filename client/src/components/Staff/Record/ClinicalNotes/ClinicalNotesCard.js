import LinearProgress from "@mui/joy/LinearProgress";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  getPatientRecord,
  postPatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDateAndTimeWithSeconds } from "../../../../utils/formatDates";
import { patientIdToName } from "../../../../utils/patientIdToName";
import { onMessageVersions } from "../../../../utils/socketHandlers/onMessageVersions";
import {
  getLastUpdate,
  isUpdated,
} from "../../../../utils/socketHandlers/updates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
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
}) => {
  //hooks
  const [editVisible, setEditVisible] = useState(false);
  const [tempFormDatas, setTempFormDatas] = useState(null);
  const [formDatas, setFormDatas] = useState(null);
  const [versions, setVersions] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [bodyVisible, setBodyVisible] = useState(true);
  const bodyRef = useRef(null);
  const { auth, user, clinic, socket } = useAuth();
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [versionsLoading, setVersionsLoading] = useState(true);
  const [attachmentsLoading, setAttachmentsLoading] = useState(true);

  useEffect(() => {
    if (!socket || !versions) return;
    const onMessage = (message) =>
      onMessageVersions(message, versions, setVersions, clinicalNote.id);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [clinicalNote.id, socket, versions]);

  useEffect(() => {
    if (clinicalNote) {
      setFormDatas(clinicalNote);
      setTempFormDatas(clinicalNote);
    }
  }, [clinicalNote]);

  useEffect(() => {
    setBodyVisible(allBodiesVisible);
  }, [allBodiesVisible]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchVersions = async () => {
      try {
        setVersionsLoading(true);
        const versionsResults = (
          await axiosXanoStaff.post(
            "/clinical_notes_log_for_clinical_note_id",
            { patient_id: patientId, clinical_note_id: clinicalNote.id },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.authToken}`,
              },
              ...(abortController && { signal: abortController.signal }),
            }
          )
        ).data;

        if (abortController.signal.aborted) {
          setVersionsLoading(false);
          return;
        }
        versionsResults.forEach(
          (version) => (version.id = version.clinical_note_id) //change id field value to clinical_note_id value to match progress_notes fields
        );
        versionsResults.sort((a, b) => a.version_nbr - b.version_nbr);

        setVersions(versionsResults);
        setVersionsLoading(false);
      } catch (err) {
        setVersionsLoading(false);
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to fetch versions: ${err.message}`, {
            containerId: "A",
          });
      }
    };
    fetchVersions();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken, patientId, clinicalNote.id]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAttachments = async () => {
      try {
        setAttachmentsLoading(true);
        const response = (
          await axiosXanoStaff.post(
            "/attachments_for_clinical_note",
            { attachments_ids: clinicalNote.attachments_ids },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.authToken}`,
              },
              signal: abortController.signal,
            }
          )
        ).data;
        if (abortController.signal.aborted) {
          setAttachmentsLoading(false);
          return;
        }
        setAttachments(
          response.sort((a, b) => a.date_created - b.date_created)
        );
        setAttachmentsLoading(false);
      } catch (err) {
        setAttachmentsLoading(false);
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to fetch attachments: ${err.message}`, {
            containerId: "A",
          });
      }
    };
    fetchAttachments();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken, clinicalNote.attachments_ids]);

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
      //First post the former progress note version to the progress note log tbl
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
        //then put the new progress note version in the progress note tbl
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
        ).filter(
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
        toast.success("Progress note saved successfully", { containerId: "A" });
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
    <div className="clinical-notes__card">
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
                  clinic.staffInfos,
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
                clinic.staffInfos,
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
          title={`CALVIN AI talk about ${patientIdToName(
            clinic.demographicsInfos,
            patientId
          )}`}
          width={1000}
          height={window.innerHeight}
          x={(window.innerWidth - 1000) / 2}
          y={0}
          color="#9CB9E4"
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
