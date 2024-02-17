import React from "react";
import useAuthContext from "../../../../hooks/useAuthContext";
import { toLocalDateAndTime } from "../../../../utils/formatDates";
import { patientIdToName } from "../../../../utils/patientIdToName";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";

const Message = ({ message, index }) => {
  const { clinic } = useAuthContext();
  return (
    <div
      className="message"
      style={{ marginLeft: `${parseInt(index) * 20}px` }}
    >
      <div className="message__title">
        <div className="message__author">
          From:{" "}
          {staffIdToTitleAndName(clinic.staffInfos, message.from_id, true)}
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
                staffIdToTitleAndName(clinic.staffInfos, staff_id, true)
              )
              .join(", ")
          : message.to_staff_id
          ? staffIdToTitleAndName(clinic.staffInfos, message.to_staff_id, true)
          : patientIdToName(clinic.demographicsInfos, message.to_patient_id)}
      </div>
      <div className="message__body">{message.body}</div>
    </div>
  );
};

export default Message;
