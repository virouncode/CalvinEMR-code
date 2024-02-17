import React, { useState } from "react";
import { useParams } from "react-router-dom";
import usePatientDemoSocket from "../../../../hooks/usePatientDemoSocket";
import CircularProgressMedium from "../../../All/UI/Progress/CircularProgressMedium";
import PatientMenuLeft from "./PatientMenuLeft";

const PatientRecord = ({
  demographicsInfos,
  setDemographicsInfos,
  loadingPatient,
  errPatient,
}) => {
  //HOOKS
  const { id } = useParams();
  const [allContentsVisible, setAllContentsVisible] = useState(true);

  usePatientDemoSocket(demographicsInfos, setDemographicsInfos);

  const handleClickFold = (e) => {
    setAllContentsVisible((v) => !v);
  };

  return demographicsInfos ? (
    <>
      <button
        type="button"
        className="patient-record__fold"
        onClick={handleClickFold}
      >
        {allContentsVisible ? "Fold All" : "Unfold All"}
      </button>
      <div className="patient-record__content">
        <PatientMenuLeft
          demographicsInfos={demographicsInfos}
          setDemographicsInfos={setDemographicsInfos}
          patientId={parseInt(id)}
          allContentsVisible={allContentsVisible}
          loadingPatient={loadingPatient}
          errPatient={errPatient}
        />
        {/* <ClinicalNotes
          demographicsInfos={demographicsInfos}
          allContentsVisible={allContentsVisible}
          patientId={parseInt(id)}
        />
        <PatientMenuRight
          demographicsInfos={demographicsInfos}
          patientId={parseInt(id)}
          allContentsVisible={allContentsVisible}
        /> */}
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
      <CircularProgressMedium />
    </div>
  );
};

export default PatientRecord;
