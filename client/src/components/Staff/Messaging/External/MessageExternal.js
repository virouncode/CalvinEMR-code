import React from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { timestampToDateTimeStrTZ } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";

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
          <div>{timestampToDateTimeStrTZ(message.date_created)}</div>
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
