import React from "react";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import { toLocalDateAndTime } from "../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/toPatientName";

const MessageExternal = ({ message, index }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <div
      className="message"
      style={{ marginLeft: `${parseInt(index) * 20}px` }}
    >
      <div className="message__title">
        <div className="message__author">
          From:{" "}
          {message.from_staff_id
            ? staffIdToTitleAndName(staffInfos, message.from_staff_id)
            : toPatientName(message.from_patient_infos)}
        </div>
        <div className="message__date">
          <div>{toLocalDateAndTime(message.date_created)}</div>
        </div>
      </div>
      <div className="message__subtitle">
        to:{" "}
        {message.to_staff_id
          ? staffIdToTitleAndName(staffInfos, message.to_staff_id)
          : toPatientName(message.to_patient_infos)}
      </div>
      <div className="message__body">{message.body}</div>
    </div>
  );
};

export default MessageExternal;
