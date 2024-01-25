import React from "react";

const GuestPatientResultItem = ({ guest, handleAddGuest }) => {
  return (
    <li key={guest.patient_id} data-key={guest.patient_id} data-type="patient">
      <span>
        {guest.Names.LegalName.FirstName.Part}{" "}
        {guest.Names.LegalName.OtherName.Part}{" "}
        {guest.Names.LegalName.LastName.Part} (Patient)
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
