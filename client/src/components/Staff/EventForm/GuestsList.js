import React from "react";
import GuestPatientItem from "./GuestPatientItem";
import GuestStaffItem from "./GuestStaffItem";

const GuestsList = ({
  staffGuestsInfos,
  patientsGuestsInfos,
  handleRemoveGuest,
}) => {
  return (
    <p className="guests-list">
      {patientsGuestsInfos.map((patient) => (
        <GuestPatientItem
          key={patient.patient_id}
          guest={patient}
          handleRemoveGuest={handleRemoveGuest}
        />
      ))}
      {staffGuestsInfos.map((staff) => (
        <GuestStaffItem
          key={staff.id}
          guest={staff}
          handleRemoveGuest={handleRemoveGuest}
        />
      ))}
    </p>
  );
};

export default GuestsList;
