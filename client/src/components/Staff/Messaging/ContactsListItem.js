import React from "react";
import formatName from "../../../utils/formatName";

const ContactsListItem = ({
  info,
  handleCheckContact,
  isContactChecked,
  categoryName,
}) => {
  return (
    <li className="contacts-list__item">
      <input
        id={info.id}
        type="checkbox"
        onChange={handleCheckContact}
        checked={isContactChecked(info.id)}
        name={categoryName}
      />
      <label htmlFor={info.id}>{formatName(info.full_name)}</label>
    </li>
  );
};

export default ContactsListItem;
