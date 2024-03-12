import React from "react";
import { toPatientName } from "../../../utils/toPatientName";

const GuestPatientResultItem = ({
  guest,
  handleAddGuest,
  lastItemRef = null,
}) => {
  return (
    <li
      key={guest.patient_id}
      data-key={guest.patient_id}
      data-type="patient"
      ref={lastItemRef}
    >
      <span>{toPatientName(guest)}</span>
      <i
        style={{ marginLeft: "10px", cursor: "pointer" }}
        className="fa-solid fa-user-plus"
        onClick={(e) => handleAddGuest(guest, e)}
      ></i>
    </li>
  );
};

export default GuestPatientResultItem;
