import React from "react";
import PatientTopic from "./PatientTopic";

const PatientMenuRight = ({
  patientId,
  allContentsVisible,
  demographicsInfos,
}) => {
  return (
    <div className="patient-record__menu">
      <PatientTopic
        url="/care_elements_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#495867"
        topic="CARE ELEMENTS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="rigth"
      />
      <PatientTopic
        url="/problemlist_for_patient"
        textColor="#FEFEFE"
        backgroundColor="#577399"
        topic="PROBLEM LIST"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="right"
      />
      <PatientTopic
        url="/reminders_for_patient"
        textColor="#FEFEFE"
        backgroundColor="#326771"
        topic="REMINDERS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="right"
      />
      <PatientTopic
        url="/pregnancies_for_patient"
        textColor="#FEFEFE"
        backgroundColor="#01ba95"
        topic="PREGNANCIES"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="right"
      />
      <PatientTopic
        url="/allergies_for_patient"
        textColor="#FEFEFE"
        backgroundColor="#2c8c99"
        topic="ALLERGIES & ADVERSE REACTIONS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
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
        side="right"
      />
      <PatientTopic
        url="/reports_for_patient"
        textColor="#FEFEFE"
        backgroundColor="#931621"
        topic="REPORTS"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        allContentsVisible={allContentsVisible}
        side="right"
      />
      <PatientTopic
        url="/immunizations_of_patient"
        textColor="#FEFEFE"
        backgroundColor="#28464b"
        topic="IMMUNIZATIONS"
        patientId={patientId}
        allContentsVisible={allContentsVisible}
        side="right"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        url="/appointments_for_patient"
        textColor="#FEFEFE"
        backgroundColor="#21201e"
        topic="APPOINTMENTS"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        allContentsVisible={allContentsVisible}
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
        side="right"
      />
    </div>
  );
};
export default PatientMenuRight;
