import React from "react";

const GuestPatientResultItem = ({
  guest,
  handleAddGuest,
  lastPatientRef = null,
}) => {
  return (
    <li
      key={guest.patient_id}
      data-key={guest.patient_id}
      data-type="patient"
      ref={lastPatientRef}
    >
      <span>
        {guest.Names.LegalName.FirstName.Part}{" "}
        {guest.Names.LegalName.OtherName?.[0]?.Part}{" "}
        {guest.Names.LegalName.LastName.Part}
      </span>
      <i
        style={{ marginLeft: "10px", cursor: "pointer" }}
        className="fa-solid fa-user-plus"
        onClick={(e) => handleAddGuest(guest, e)}
      ></i>
    </li>
  );
};

export default GuestPatientResultItem;
