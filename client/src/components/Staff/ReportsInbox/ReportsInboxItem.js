import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { putPatientRecord } from "../../../api/fetchRecords";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../utils/formatDates";
import { showDocument } from "../../../utils/showDocument";
import { showReportTextContent } from "../../../utils/showReportTextContent";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../utils/staffIdToName";
import { toPatientName } from "../../../utils/toPatientName";
import SignCell from "../Record/Topics/SignCell";

const ReportsInboxItem = ({
  item,
  setForwardVisible,
  forwardVisible,
  setReportToForwardId,
  lastItemRef = null,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [progress, setProgress] = useState(false);

  const handleAcknowledge = async () => {
    try {
      setProgress(true);
      const datasToPut = { ...item };
      datasToPut.acknowledged = true;
      datasToPut.ReportReviewed = [
        {
          Name: {
            FirstName: staffIdToFirstName(staffInfos, user.id),
            LastName: staffIdToLastName(staffInfos, user.id),
          },
          ReviewingOHIPPhysicianId: staffIdToOHIP(staffInfos, user.id),
          DateTimeReportReviewed: nowTZTimestamp(),
        },
      ];

      await putPatientRecord(
        `/reports/${item.id}`,
        user.id,
        datasToPut,
        socket,
        "REPORTS"
      );

      socket.emit("message", {
        route: "REPORTS INBOX",
        action: "update",
        content: { id: item.id, data: datasToPut },
      });

      toast.success("Document acknowledged successfully", {
        containerId: "A",
      });
      setProgress(false);
    } catch (err) {
      toast.error(`Unable to acknowledge document : ${err.message}`, {
        containerId: "A",
      });
      setProgress(false);
    }
  };

  const handleForward = (e, reportId) => {
    setForwardVisible(true);
    setReportToForwardId(reportId);
  };

  return (
    <tr className="reports__item" ref={lastItemRef}>
      <td>{item.name}</td>
      <td>{item.Format}</td>
      <td>{item.FileExtensionAndVersion}</td>
      <td
        className="reports__link"
        onClick={() =>
          item.File
            ? showDocument(item.File?.url, item.File?.mime)
            : showReportTextContent(item)
        }
        style={{
          fontWeight: item.ReportReviewed.length ? "normal" : "bold",
          color: item.ReportReviewed.length ? "black" : "blue",
        }}
      >
        {item.File ? item.File.name : "See text content"}
      </td>
      <td>{item.Class}</td>
      <td>{item.SubClass}</td>
      <td>
        <NavLink
          className="reports__link"
          to={`/staff/patient-record/${item.patient_id}`}
          // target="_blank"
        >
          {" "}
          {toPatientName(item.patient_infos)}
        </NavLink>
      </td>
      <td>{timestampToDateISOTZ(item.EventDateTime)}</td>
      <td>{timestampToDateISOTZ(item.ReceivedDateTime)}</td>
      <td>
        {item.SourceAuthorPhysician?.AuthorFreeText
          ? item.SourceAuthorPhysician.AuthorFreeText
          : item.SourceAuthorPhysician?.AuthorName?.FirstName
          ? `${item.SourceAuthorPhysician?.AuthorName?.FirstName} ${item.SourceAuthorPhysician?.AuthorName?.LastName}`
          : ""}
      </td>
      <td>{item.Notes}</td>
      <SignCell item={item} staffInfos={staffInfos} />
      <td>
        <div className="reports__item-btn-container">
          <button onClick={handleAcknowledge} disabled={progress}>
            Acknowledge
          </button>
          <button
            onClick={(e) => handleForward(e, item.id)}
            disabled={forwardVisible || progress}
          >
            Forward
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReportsInboxItem;
