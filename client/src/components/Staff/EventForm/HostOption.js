import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

const HostOption = ({ staff }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <option value={staff.id} key={staff.id}>
      {staffIdToTitleAndName(staffInfos, staff.id)} ({staff.title})
    </option>
  );
};

export default HostOption;
