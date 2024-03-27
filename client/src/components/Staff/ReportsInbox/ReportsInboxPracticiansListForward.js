import React from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import ReportsInboxPracticiansListItemForward from "./ReportsInboxPracticiansListItemForward";

const ReportsInboxPracticiansListForward = ({
  categoryInfos,
  handleCheckPractician,
  isPracticianChecked,
  categoryName,
}) => {
  const { user } = useUserContext();
  return (
    <ul className="practicians-forward__category-list">
      {categoryInfos
        .filter(({ id }) => id !== user.id)
        .map((info) => (
          <ReportsInboxPracticiansListItemForward
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

export default ReportsInboxPracticiansListForward;
