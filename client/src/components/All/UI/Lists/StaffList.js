import React from "react";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";

const StaffList = ({ value, name, handleChange, staffInfos }) => {
  return (
    <select value={value} name={name} onChange={handleChange}>
      <option value="0">(None)</option>
      {staffInfos
        .filter(({ title }) => title !== "Secretary")
        .map((staff) => (
          <option value={staff.id} key={staff.id}>
            {staffIdToTitleAndName(staffInfos, staff.id, true)}
          </option>
        ))}
    </select>
  );
};

export default StaffList;
