import React from "react";
import ContactsListItem from "./ContactsListItem";

const ContactsList = ({
  categoryInfos,
  handleCheckContact,
  isContactChecked,
  categoryName,
}) => {
  return (
    <ul className="contacts-list">
      {categoryInfos.map((info) => (
        <ContactsListItem
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

export default ContactsList;
