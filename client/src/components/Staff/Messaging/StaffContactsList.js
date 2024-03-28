import React from "react";
import StaffContactsListItem from "./StaffContactsListItem";

const StaffContactsList = ({
  categoryInfos,
  handleCheckContact,
  isContactChecked,
  categoryName,
}) => {
  return (
    <ul className="contacts-list">
      {categoryInfos.map((info) => (
        <StaffContactsListItem
          info={info}
          key={info.id}
          handleCheckContact={handleCheckContact}
          isContactChecked={isContactChecked}
          categoryName={categoryName}
        />
      ))}
    </ul>
  );
};

export default StaffContactsList;
