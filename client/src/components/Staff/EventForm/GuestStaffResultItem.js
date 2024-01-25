import React from "react";

const GuestStaffResultItem = ({ guest, handleAddGuest }) => {
  return (
    <li key={guest.id} data-key={guest.id} data-type="staff">
      <span>
        {guest.full_name} ({guest.title})
      </span>
      <i
        style={{ marginLeft: "10px", cursor: "pointer" }}
        className="fa-solid fa-user-plus"
        onClick={(e) => handleAddGuest(guest, e)}
      ></i>
    </li>
  );
};

export default GuestStaffResultItem;
