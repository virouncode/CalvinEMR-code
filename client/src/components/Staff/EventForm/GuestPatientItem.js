import React from "react";
import { NavLink } from "react-router-dom";

const GuestPatientItem = ({ guest, handleRemoveGuest }) => {
  return (
    <>
      <NavLink
        to={`/staff/patient-record/${guest.id}`}
        className="guest-patient-item"
        target="_blank"
      >
        {guest.Names.LegalName.FirstName.Part}{" "}
        {guest.Names.LegalName.OtherName.Part}{" "}
        {guest.Names.LegalName.LastName.Part} (Patient){" "}
      </NavLink>
      <span data-key={guest.patient_id} data-type="patient">
        <i
          className="fa-solid fa-trash"
          onClick={handleRemoveGuest}
          style={{ cursor: "pointer" }}
        />
      </span>
      ,{" "}
    </>
  );
};

export default GuestPatientItem;
