import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { categoryToTitle } from "../../../utils/names/categoryToTitle";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

const FilterStaffItem = ({
  staff,
  category,
  isChecked,
  handleCheck,
  color,
}) => {
  const { staffInfos } = useStaffInfosContext();
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
        {staffIdToTitleAndName(staffInfos, staff.id)}
      </label>
    </li>
  );
};

export default FilterStaffItem;
