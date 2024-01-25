import React from "react";
import useAuth from "../../../../hooks/useAuth";
import { patientIdToName } from "../../../../utils/patientIdToName";

const PatientsSelect = ({ handleChange, value, name, id, patientId = 0 }) => {
  const { clinic } = useAuth();
  return (
    <select name={name} onChange={handleChange} value={value} id={id}>
      <option value="" disabled>
        Choose a patient
      </option>
      {clinic.demographicsInfos &&
        clinic.demographicsInfos.length &&
        clinic.demographicsInfos
          .filter(({ patient_id }) => patient_id !== patientId)
          .sort((a, b) =>
            patientIdToName(
              clinic.demographicsInfos,
              a.patient_id
            ).localeCompare(
              patientIdToName(clinic.demographicsInfos, b.patient_id)
            )
          )
          .map((item) => (
            <option value={item.patient_id} key={item.patient_id}>
              {patientIdToName(clinic.demographicsInfos, item.patient_id)}
            </option>
          ))}
    </select>
  );
};

export default PatientsSelect;
