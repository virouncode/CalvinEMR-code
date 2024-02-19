import React from "react";
import useIntersection from "../../../../hooks/useIntersection";
import { toPatientName } from "../../../../utils/toPatientName";

const PatientsSelect = ({
  id = null,
  handleChange,
  value,
  name,
  patientId = 0,
  patients,
  setPaging,
  loading,
  hasMore,
}) => {
  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  return (
    <select
      name={name}
      onChange={handleChange}
      value={value}
      ref={rootRef}
      id={id}
    >
      <option value="" disabled>
        Choose a patient
      </option>
      {patients
        .filter(({ patient_id }) => patient_id !== patientId)
        .map(
          (item, index) =>
            (index =
              patients.length - 1 ? (
                <option
                  value={item.patient_id}
                  key={item.patient_id}
                  ref={lastItemRef}
                  data-gender={item.Gender}
                >
                  {toPatientName(item)}
                </option>
              ) : (
                <option value={item.patient_id} key={item.patient_id}>
                  {toPatientName(item)}
                </option>
              ))
        )}
    </select>
  );
};

export default PatientsSelect;
