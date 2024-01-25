import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import { onMessagePatientRecord } from "../../../../utils/socketHandlers/onMessagePatientRecord";
import ClinicalNotes from "../ClinicalNotes/ClinicalNotes";
import PatientMenuLeft from "./PatientMenuLeft";
import PatientMenuRight from "./PatientMenuRight";

const PatientRecord = () => {
  //HOOKS
  const { clinic, socket } = useAuth();
  const [demographicsInfos, setDemographicsInfos] = useState(null);
  const { id } = useParams();
  const [allContentsVisible, setAllContentsVisible] = useState(true);

  useEffect(() => {
    setDemographicsInfos(
      clinic.demographicsInfos.find(
        (patient) => patient.patient_id === parseInt(id)
      )
    );
  }, [id, clinic.demographicsInfos]);

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessagePatientRecord(message, setDemographicsInfos);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [socket]);

  const handleClick = (e) => {
    setAllContentsVisible((v) => !v);
  };

  return demographicsInfos ? (
    <>
      <button
        type="button"
        className="patient-record__fold"
        onClick={handleClick}
      >
        {allContentsVisible ? "Fold All" : "Unfold All"}
      </button>
      <div className="patient-record__content">
        <PatientMenuLeft
          demographicsInfos={demographicsInfos}
          setDemographicsInfos={setDemographicsInfos}
          patientId={parseInt(id)}
          allContentsVisible={allContentsVisible}
        />
        <ClinicalNotes
          demographicsInfos={demographicsInfos}
          allContentsVisible={allContentsVisible}
          patientId={parseInt(id)}
        />
        <PatientMenuRight
          demographicsInfos={demographicsInfos}
          patientId={parseInt(id)}
          allContentsVisible={allContentsVisible}
        />
      </div>
    </>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default PatientRecord;
