import React from "react";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDateAndTime } from "../../../../utils/formatDates";
import { patientIdToName } from "../../../../utils/patientIdToName";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";

const MessageExternal = ({ message, index }) => {
  const { clinic } = useAuth();
  return (
    <div
      className="message"
      style={{ marginLeft: `${parseInt(index) * 20}px` }}
    >
      <div className="message__title">
        <div className="message__author">
          From:{" "}
          {message.from_user_type === "staff"
            ? staffIdToTitleAndName(clinic.staffInfos, message.from_id, true)
            : patientIdToName(clinic.demographicsInfos, message.from_id)}
        </div>
        <div className="message__date">
          <div>{toLocalDateAndTime(message.date_created)}</div>
        </div>
      </div>
      <div className="message__subtitle">
        to:{" "}
        {message.to_user_type === "staff"
          ? staffIdToTitleAndName(clinic.staffInfos, message.to_id, true)
          : patientIdToName(clinic.demographicsInfos, message.to_id)}
      </div>
      <div className="message__body">{message.body}</div>
    </div>
  );
};

export default MessageExternal;
