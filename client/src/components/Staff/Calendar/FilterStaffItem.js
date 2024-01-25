import React from "react";
import useAuth from "../../../hooks/useAuth";
import { categoryToTitle } from "../../../utils/categoryToTitle";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";

const FilterStaffItem = ({
  staff,
  category,
  isChecked,
  handleCheck,
  color,
}) => {
  const { clinic } = useAuth();
  return (
    <li>
      <input
        type="checkbox"
        className="filter-checkbox"
        name={categoryToTitle(category).toLowerCase()}
        id={staff.id}
        checked={isChecked(staff.id)}
        onChange={handleCheck}
        style={{ accentColor: color }}
      />
      <label htmlFor={staff.id}>
        {staffIdToTitleAndName(clinic.staffInfos, staff.id, true)}
      </label>
    </li>
  );
};

export default FilterStaffItem;
