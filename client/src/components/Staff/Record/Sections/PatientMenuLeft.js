import React from "react";
import { toPatientName } from "../../../../utils/toPatientName";
import PatientTopic from "./PatientTopic";
import PatientTopicDoctors from "./PatientTopicDoctors";

const PatientMenuLeft = ({
  demographicsInfos,
  patientId,
  allContentsVisible,
  loadingPatient,
  errPatient,
}) => {
  return (
    <div className="patient-record__menu">
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#495867"
        topic="DEMOGRAPHICS"
        patientName={toPatientName(demographicsInfos)}
        demographicsInfos={demographicsInfos}
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
        loadingPatient={loadingPatient}
        errPatient={errPatient}
      />
      <PatientTopic
        url="/past_health_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#577399"
        topic="PAST HEALTH"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />

      <PatientTopic
        url="/family_history_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#326771"
        topic="FAMILY HISTORY"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        url="/relationships_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#01ba95"
        topic="RELATIONSHIPS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
        demographicsInfos={demographicsInfos}
      />

      <PatientTopic
        url="/alerts_for_patient"
        textColor="#FEFEFE"
        backgroundColor="#2c8c99"
        topic="ALERTS & SPECIAL NEEDS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        url="/risk_factors_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#ef0b00"
        topic="RISK FACTORS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />

      <PatientTopic
        url="/medications_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#931621"
        topic="MEDICATIONS AND TREATMENTS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopicDoctors
        textColor="#FEFEFE"
        backgroundColor="#21201e"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        url="/pharmacies"
        textColor="#FEFEFE"
        backgroundColor="#28464b"
        topic="PHARMACIES"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        url="/eforms_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#2acbd6"
        topic="E-FORMS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        url="/personal_history_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#CE2D4F"
        topic="PERSONAL HISTORY"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
        demographicsInfos={demographicsInfos}
      />
    </div>
  );
};

export default PatientMenuLeft;
