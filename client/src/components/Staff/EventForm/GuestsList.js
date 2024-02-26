import React from "react";
import GuestPatientItem from "./GuestPatientItem";
import GuestStaffItem from "./GuestStaffItem";

const GuestsList = ({ tempFormDatas, handleRemoveGuest }) => {
  return (
    tempFormDatas && (
      <p className="guests-list">
        {tempFormDatas.patients_guests_ids.map(({ patient_infos }) => (
          <GuestPatientItem
            key={patient_infos.patient_id}
            guest={patient_infos}
            handleRemoveGuest={handleRemoveGuest}
          />
        ))}
        {tempFormDatas.staff_guests_ids.map(({ staff_infos }) => (
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
