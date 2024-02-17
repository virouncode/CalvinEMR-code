import React from "react";
import useAuthContext from "../../../hooks/useAuthContext";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";

const DocMailboxPracticiansListItem = ({
  info,
  handleCheckPractician,
  isPracticianChecked,
  categoryName,
}) => {
  const { clinic } = useAuthContext();
  return (
    <li className="practicians__list-item">
      <input
        id={info.id}
        type="checkbox"
        onChange={handleCheckPractician}
        checked={isPracticianChecked(info.id)}
        name={categoryName}
      />
      <label htmlFor={info.id}>
        {staffIdToTitleAndName(clinic.staffInfos, info.id, true)}
      </label>
    </li>
  );
};

export default DocMailboxPracticiansListItem;
