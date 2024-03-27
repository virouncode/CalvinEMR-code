import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

const GuestStaffResultItem = ({ guest, handleAddGuest }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <li key={guest.id} data-key={guest.id} data-type="staff">
      <span>
        {staffIdToTitleAndName(staffInfos, guest.id, false)} ({guest.title})
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
