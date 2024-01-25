import React from "react";
import DocMailboxPracticiansListItem from "./DocMailboxPracticiansListItem";

const DocMailboxPracticiansList = ({
  categoryInfos,
  handleCheckPractician,
  isPracticianChecked,
  categoryName,
}) => {
  return (
    <ul className="practicians__category-list">
      {categoryInfos.map((info) => (
        <DocMailboxPracticiansListItem
          info={info}
          key={info.id}
          handleCheckPractician={handleCheckPractician}
          isPracticianChecked={isPracticianChecked}
          categoryName={categoryName}
        />
      ))}
    </ul>
  );
};

export default DocMailboxPracticiansList;
