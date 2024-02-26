import React from "react";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import { toLocalDateAndTime } from "../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/toPatientName";

const Message = ({ message, index }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <div
      className="message"
      style={{ marginLeft: `${parseInt(index) * 20}px` }}
    >
      <div className="message__title">
        <div className="message__author">
          From: {staffIdToTitleAndName(staffInfos, message.from_id, true)}
        </div>
        <div className="message__date">
          <div>{toLocalDateAndTime(message.date_created)}</div>
        </div>
      </div>
      <div className="message__subtitle">
        to:{" "}
        {message.type === "Internal"
          ? message.to_staff_ids
              .map((staff_id) =>
                staffIdToTitleAndName(staffInfos, staff_id, true)
              )
              .join(", ")
          : message.to_staff_id
          ? staffIdToTitleAndName(staffInfos, message.to_staff_id, true)
          : toPatientName(message.to_patient_infos)}
      </div>
      <div className="message__body">{message.body}</div>
    </div>
  );
};

export default Message;
