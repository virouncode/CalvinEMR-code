import React, { useState } from "react";
import StaffContactsList from "./StaffContactsList";

const StaffContactsCategory = ({
  categoryInfos,
  categoryName,
  isContactChecked,
  handleCheckContact,
  isCategoryChecked,
  handleCheckCategory,
}) => {
  const [listVisible, setListVisible] = useState(false);
  const handleClick = (e) => {
    setListVisible((v) => !v);
  };
  return (
    <>
      <div className="contacts__category-overview">
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
        <input
          type="checkbox"
          id={categoryName}
          checked={isCategoryChecked(categoryName)}
          onChange={handleCheckCategory}
        />
        <label htmlFor={categoryName}>{categoryName}</label>
      </div>
      {listVisible && (
        <StaffContactsList
          categoryInfos={categoryInfos}
          isContactChecked={isContactChecked}
          handleCheckContact={handleCheckContact}
          categoryName={categoryName}
        />
      )}
    </>
  );
};

export default StaffContactsCategory;
