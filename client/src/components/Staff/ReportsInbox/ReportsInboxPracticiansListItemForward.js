import React from "react";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";

const ReportsInboxPracticiansListItemForward = ({
  info,
  handleCheckPractician,
  isPracticianChecked,
  categoryName,
}) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <li className="practicians-forward__list-item">
      <input
        id={info.id}
        type="checkbox"
        onChange={handleCheckPractician}
        checked={isPracticianChecked(info.id)}
        name={categoryName}
      />
      <label htmlFor={info.id}>
        {staffIdToTitleAndName(staffInfos, info.id)}
      </label>
    </li>
  );
};

export default ReportsInboxPracticiansListItemForward;
