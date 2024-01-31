import React from "react";
import PatientTopic from "./PatientTopic";

const PatientMenuLeft = ({
  demographicsInfos,
  setDemographicsInfos,
  patientId,
  allContentsVisible,
}) => {
  return (
    <div className="patient-record__menu">
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#495867"
        topic="DEMOGRAPHICS"
        demographicsInfos={demographicsInfos}
        setDemographicsInfos={setDemographicsInfos}
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        url="/past_health_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#577399"
        topic="PAST HEALTH"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        url="/family_history_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#326771"
        topic="FAMILY HISTORY"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        url="/relationships_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#01ba95"
        topic="RELATIONSHIPS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        url="/alerts_for_patient"
        textColor="#FEFEFE"
        backgroundColor="#2c8c99"
        topic="ALERTS & SPECIAL NEEDS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        url="/risk_factors_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#ef0b00"
        topic="RISK FACTORS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        url="/medications_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#931621"
        topic="MEDICATIONS AND TREATMENTS"
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
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        url="/doctors"
        textColor="#FEFEFE"
        backgroundColor="#21201e"
        topic="FAMILY DOCTORS/SPECIALISTS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        url="/eforms_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#2acbd6"
        topic="E-FORMS"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        allContentsVisible={allContentsVisible}
        side="left"
      />
      <PatientTopic
        url="/personal_history_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#CE2D4F"
        topic="PERSONAL HISTORY"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        allContentsVisible={allContentsVisible}
        side="left"
      />
    </div>
  );
};

export default PatientMenuLeft;
