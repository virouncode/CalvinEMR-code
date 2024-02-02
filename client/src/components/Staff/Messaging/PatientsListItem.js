import React from "react";

const PatientsListItem = ({
  info,
  handleCheckPatient,
  isPatientChecked,
  patientName,
  isLoading,
}) => {
  return (
    <li className="patients__list-item">
      <input
        id={info.patient_id}
        type="checkbox"
        onChange={handleCheckPatient}
        checked={isPatientChecked(info.patient_id)}
        name={patientName}
        disabled={isLoading}
      />
      <label htmlFor={info.patient_id}>{patientName}</label>
    </li>
  );
};

export default PatientsListItem;
