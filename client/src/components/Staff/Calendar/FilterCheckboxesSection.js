import React from "react";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { categoryToTitle } from "../../../utils/categoryToTitle";
import FilterStaffItem from "./FilterStaffItem";

const FilterCheckboxesSection = ({
  isCategoryChecked,
  handleCheckCategory,
  category,
  isChecked,
  handleCheck,
  remainingStaff,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  return (
    <ul>
      <li>
        <input
          type="checkbox"
          className="filter-checkbox-category"
          name={category}
          id={category}
          checked={isCategoryChecked(category)}
          onChange={(e) => handleCheckCategory(category, e)}
          style={{ accentColor: "#bfbfbf" }}
          autoComplete="off"
        />
        <label htmlFor={category} className="filter-category-label">
          {category}
        </label>
      </li>
      {staffInfos
        .filter(({ title }) => title === categoryToTitle(category))
        .map((staff) => (
          <FilterStaffItem
            key={staff.id}
            staff={staff}
            category={category}
            isChecked={isChecked}
            handleCheck={handleCheck}
            color={
              staff.id !== user.id
                ? remainingStaff.find(({ id }) => id === staff.id)?.color
                : "#93B5E9"
            }
          />
        ))}
    </ul>
  );
};

export default FilterCheckboxesSection;
