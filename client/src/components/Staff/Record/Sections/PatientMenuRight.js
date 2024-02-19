import React from "react";
import { toPatientName } from "../../../../utils/toPatientName";
import PatientTopic from "./PatientTopic";
import PatientTopicImmunizations from "./PatientTopicImmunizations";
import PatientTopicReports from "./PatientTopicReports";

const PatientMenuRight = ({
  demographicsInfos,
  patientId,
  allContentsVisible,
  loadingPatient,
  errPatient,
}) => {
  return (
    <div className="patient-record__menu">
      <PatientTopic
        url="/personal_history_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#495867"
        topic="PERSONAL HISTORY"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="right"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        url="/care_elements_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#577399"
        topic="CARE ELEMENTS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
      />
      <PatientTopic
        url="/problemlist_for_patient"
        textColor="#FEFEFE"
        backgroundColor="#326771"
        topic="PROBLEM LIST"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
      />
      <PatientTopic
        url="/pregnancies_for_patient"
        textColor="#FEFEFE"
        backgroundColor="#01ba95"
        topic="PREGNANCIES"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
      />
      <PatientTopic
        url="/allergies_for_patient"
        textColor="#FEFEFE"
        backgroundColor="#2c8c99"
        topic="ALLERGIES & ADVERSE REACTIONS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
      />
      <PatientTopic
        url="/laboratory_results_for_patient"
        textColor="#FEFEFE"
        backgroundColor="#ef0b00"
        topic="LABORATORY RESULTS"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        allContentsVisible={allContentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
      />

      <PatientTopicReports
        textColor="#FEFEFE"
        backgroundColor="#931621"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        allContentsVisible={allContentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
      />

      <PatientTopicImmunizations
        textColor="#FEFEFE"
        backgroundColor="#21201e"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        patientName={toPatientName(demographicsInfos)}
        patientDob={demographicsInfos.DateOfBirth}
        side="right"
        loadingPatient={loadingPatient}
        errPatient={errPatient}
      />

      <PatientTopic
        url="/appointments_for_patient"
        textColor="#FEFEFE"
        backgroundColor="#28464b"
        topic="APPOINTMENTS"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        allContentsVisible={allContentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
      />

      <PatientTopic
        url="/messages_about_patient"
        textColor="#FEFEFE"
        backgroundColor="#2acbd6"
        topic="MESSAGES ABOUT PATIENT"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        allContentsVisible={allContentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
      />
      <PatientTopic
        url="/messages_external_for_patient"
        textColor="#FEFEFE"
        backgroundColor="#CE2D4F"
        topic="MESSAGES WITH PATIENT"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        allContentsVisible={allContentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
      />
    </div>
  );
};
export default PatientMenuRight;
