import React from "react";

const PatientsListItem = ({
  info,
  handleCheckPatient,
  isPatientChecked,
  patientName,
  isLoading,
  lastItemRef = null,
}) => {
  return (
    <li className="patients__list-item" ref={lastItemRef}>
      <input
        id={info.patient_id}
        type="checkbox"
        onChange={(e) => handleCheckPatient(e, info.assigned_staff_id)}
        checked={isPatientChecked(info.patient_id)}
        name={patientName}
        disabled={isLoading}
      />
      <label htmlFor={info.patient_id}>{patientName}</label>
    </li>
  );
};

export default PatientsListItem;
