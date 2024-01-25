import React from "react";
import useAuth from "../../../hooks/useAuth";
import DocMailboxPracticiansListItemForward from "./DocMailboxPracticiansListItemForward";

const DocMailboxPracticiansListForward = ({
  categoryInfos,
  handleCheckPractician,
  isPracticianChecked,
  categoryName,
}) => {
  const { user } = useAuth();
  return (
    <ul className="practicians-forward__category-list">
      {categoryInfos
        .filter(({ id }) => id !== user.id)
        .map((info) => (
          <DocMailboxPracticiansListItemForward
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

export default DocMailboxPracticiansListForward;
