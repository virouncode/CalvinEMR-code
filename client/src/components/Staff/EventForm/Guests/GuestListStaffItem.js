import React from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";

const GuestListStaffItem = ({ guest, handleRemoveGuest }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <span key={guest.id} data-key={guest.id} data-type="staff">
      <span>{staffIdToTitleAndName(staffInfos, guest.id, false)}</span>
      <i
        className="fa-solid fa-trash"
        onClick={handleRemoveGuest}
        style={{ cursor: "pointer", marginLeft: "5px" }}
      ></i>
      ,{" "}
    </span>
  );
};

export default GuestListStaffItem;
