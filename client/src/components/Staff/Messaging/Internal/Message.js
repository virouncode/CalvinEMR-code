import React from "react";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import { timestampToDateTimeStrTZ } from "../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/toPatientName";

const Message = ({ message, index, section }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <div
      className="message"
      style={{ marginLeft: `${parseInt(index) * 20}px` }}
    >
      <div className="message__title">
        {section !== "To-dos" ? (
          <div className="message__author">
            From: {staffIdToTitleAndName(staffInfos, message.from_id)}
          </div>
        ) : (
          <div className="message__author"></div>
        )}
        <div className="message__date">
          <div>{timestampToDateTimeStrTZ(message.date_created)}</div>
        </div>
      </div>
      {section !== "To-dos" && (
        <div className="message__subtitle">
          to:{" "}
          {message.type === "Internal"
            ? message.to_staff_ids
                .map((staff_id) => staffIdToTitleAndName(staffInfos, staff_id))
                .join(", ")
            : message.to_staff_id
            ? staffIdToTitleAndName(staffInfos, message.to_staff_id)
            : toPatientName(message.to_patient_infos)}
        </div>
      )}
      <div className="message__body">{message.body}</div>
    </div>
  );
};

export default Message;
