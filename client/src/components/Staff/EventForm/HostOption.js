import React from "react";
import useAuth from "../../../hooks/useAuth";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";

const HostOption = ({ staff }) => {
  const { clinic } = useAuth();
  return (
    <option value={staff.id} key={staff.id}>
      {staffIdToTitleAndName(clinic.staffInfos, staff.id, true)} ({staff.title})
    </option>
  );
};

export default HostOption;
