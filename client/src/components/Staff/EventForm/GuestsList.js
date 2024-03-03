import React from "react";
import GuestPatientItem from "./GuestPatientItem";
import GuestStaffItem from "./GuestStaffItem";

const GuestsList = ({ tempFormDatas, handleRemoveGuest }) => {
  console.log(
    tempFormDatas.patients_guests_ids,
    tempFormDatas.staff_guests_ids
  );
  return (
    tempFormDatas && (
      <p className="guests-list">
        {tempFormDatas.patients_guests_ids
          .filter((item) => item)
          .map(({ patient_infos }) => (
            <GuestPatientItem
              key={patient_infos.patient_id}
              guest={patient_infos}
              handleRemoveGuest={handleRemoveGuest}
            />
          ))}
        {tempFormDatas.staff_guests_ids
          .filter((item) => item)
          .map(({ staff_infos }) => (
            <GuestStaffItem
              key={staff_infos.id}
              guest={staff_infos}
              handleRemoveGuest={handleRemoveGuest}
            />
          ))}
      </p>
    )
  );
};

export default GuestsList;
