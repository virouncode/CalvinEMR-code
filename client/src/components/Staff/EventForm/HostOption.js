import React from "react";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";

const HostOption = ({ staff }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <option value={staff.id} key={staff.id}>
      {staffIdToTitleAndName(staffInfos, staff.id, true)} ({staff.title})
    </option>
  );
};

export default HostOption;
