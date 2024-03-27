import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

const ContactsListItem = ({
  info,
  handleCheckContact,
  isContactChecked,
  categoryName,
}) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <li className="contacts-list__item">
      <input
        id={info.id}
        type="checkbox"
        onChange={handleCheckContact}
        checked={isContactChecked(info.id)}
        name={categoryName}
      />
      <label htmlFor={info.id}>
        {staffIdToTitleAndName(staffInfos, info.id)}
      </label>
    </li>
  );
};

export default ContactsListItem;
