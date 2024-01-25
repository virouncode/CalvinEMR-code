import React, { useState } from "react";
import ContactsList from "../../Staff/Messaging/ContactsList";

const ContactsForPatientCategory = ({
  categoryInfos,
  categoryName,
  isContactChecked,
  handleCheckContact,
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
        <label>{categoryName}</label>
      </div>
      {listVisible && (
        <ContactsList
          categoryInfos={categoryInfos}
          isContactChecked={isContactChecked}
          handleCheckContact={handleCheckContact}
          categoryName={categoryName}
        />
      )}
    </>
  );
};

export default ContactsForPatientCategory;
