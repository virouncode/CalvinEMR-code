import React from "react";
import formatName from "../../../utils/formatName";

const DocMailboxPracticiansListItemForward = ({
  info,
  handleCheckPractician,
  isPracticianChecked,
  categoryName,
}) => {
  return (
    <li className="practicians-forward__list-item">
      <input
        id={info.id}
        type="checkbox"
        onChange={handleCheckPractician}
        checked={isPracticianChecked(info.id)}
        name={categoryName}
      />
      <label htmlFor={info.id}>{formatName(info.full_name)}</label>
    </li>
  );
};

export default DocMailboxPracticiansListItemForward;
