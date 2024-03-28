import React from "react";
import GuestListPatientItem from "./GuestListPatientItem";
import GuestListStaffItem from "./GuestListStaffItem";

const GuestsList = ({ tempFormDatas, handleRemoveGuest }) => {
  return (
    tempFormDatas && (
      <p className="guests-list">
        {tempFormDatas.patients_guests_ids
          .filter((item) => item)
          .map(({ patient_infos }) => (
            <GuestListPatientItem
              key={patient_infos.patient_id}
              guest={patient_infos}
              handleRemoveGuest={handleRemoveGuest}
            />
          ))}
        {tempFormDatas.staff_guests_ids
          .filter((item) => item)
          .map(({ staff_infos }) => (
            <GuestListStaffItem
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
