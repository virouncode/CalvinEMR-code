import React, { useState } from "react";
import ReportsInboxPracticiansListForward from "./ReportsInboxPracticiansListForward";

const ReportsInboxPracticianCategoryForward = ({
  categoryInfos,
  categoryName,
  isPracticianChecked,
  handleCheckPractician,
}) => {
  const [listVisible, setListVisible] = useState(false);
  const handleClick = (e) => {
    setListVisible((v) => !v);
  };

  return (
    <>
      <div className="practicians-forward__category-overview">
        {!listVisible ? (
          <i
            onClick={handleClick}
            className="fa-regular fa-square-plus fa-lg"
          ></i>
        ) : (
          <i
            onClick={handleClick}
            className="fa-regular fa-square-minus fa-lg"
          ></i>
        )}
        <label>{categoryName}</label>
      </div>
      {listVisible && (
        <ReportsInboxPracticiansListForward
          categoryInfos={categoryInfos}
          isPracticianChecked={isPracticianChecked}
          handleCheckPractician={handleCheckPractician}
          categoryName={categoryName}
        />
      )}
    </>
  );
};

export default ReportsInboxPracticianCategoryForward;
