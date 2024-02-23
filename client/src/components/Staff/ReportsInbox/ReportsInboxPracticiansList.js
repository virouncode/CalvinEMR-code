import React from "react";
import ReportsInboxPracticiansListItem from "./ReportsInboxPracticiansListItem";

const ReportsInboxPracticiansList = ({
  categoryInfos,
  handleCheckPractician,
  isPracticianChecked,
  categoryName,
}) => {
  return (
    <ul className="practicians__category-list">
      {categoryInfos.map((info) => (
        <ReportsInboxPracticiansListItem
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

export default ReportsInboxPracticiansList;
