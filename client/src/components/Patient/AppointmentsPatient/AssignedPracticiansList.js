import React from "react";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";

const AssignedPracticiansList = ({
  assignedStaffId,
  handlePracticianChange,
  practicianSelectedId,
  staffInfos,
}) => {
  return (
    <div className="assigned-practicians-list">
      <label>With: </label>
      {/* <select
        style={{ marginLeft: "10px" }}
        onChange={handlePracticianChange}
        value={practicianSelectedId}
      >
        <option value="" disabled>
          Choose a practician...
        </option> */}
      {staffIdToTitleAndName(staffInfos, assignedStaffId, true)}
      {/* {assignedStaff.map((staff) => (
          <option key={staff.id} value={staff.id}>
            {staff.category === "Doctor"
              ? staffIdToTitleAndName(staffInfos, staff.id, true)
              : formatName(staffIdToName(staffInfos, staff.id)) +
                `(${staff.category})`}
          </option>
        ))} */}
      {/* </select> */}
    </div>
  );
};

export default AssignedPracticiansList;
