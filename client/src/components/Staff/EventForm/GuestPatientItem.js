import React from "react";
import { NavLink } from "react-router-dom";
import { toPatientName } from "../../../utils/toPatientName";

const GuestPatientItem = ({ guest, handleRemoveGuest }) => {
  return (
    <>
      <NavLink
        to={`/staff/patient-record/${guest.patient_id}`}
        className="guest-patient-item"
        // target="_blank"
      >
        {toPatientName(guest)}
      </NavLink>
      <span data-key={guest.patient_id} data-type="patient">
        <i
          className="fa-solid fa-trash"
          onClick={handleRemoveGuest}
          style={{ cursor: "pointer", marginLeft: "5px" }}
        />{" "}
        /
      </span>{" "}
    </>
  );
};

export default GuestPatientItem;
