import React from "react";

const GuestStaffItem = ({ guest, handleRemoveGuest }) => {
  return (
    <span key={guest.id} data-key={guest.id} data-type="staff">
      <span>
        {guest.full_name} ({guest.title}){" "}
      </span>
      <i
        className="fa-solid fa-trash"
        onClick={handleRemoveGuest}
        style={{ cursor: "pointer" }}
      ></i>
      ,{" "}
    </span>
  );
};

export default GuestStaffItem;
