import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { putPatientRecord } from "../../../api/fetchRecords";
import useAuth from "../../../hooks/useAuth";
import { toLocalDate } from "../../../utils/formatDates";
import { patientIdToName } from "../../../utils/patientIdToName";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";

const DocMailboxItem = ({
  item,
  showDocument,
  setDocuments,
  setForwardVisible,
  forwardVisible,
}) => {
  const { clinic, auth, user, setUser, socket } = useAuth();

  const handleAcknowledge = async () => {
    try {
      const datasToPut = { ...item };
      datasToPut.acknowledged = true;
      datasToPut.ReportReviewed = [
        {
          Name: {
            FirstName: staffIdToFirstName(clinic.staffInfos, user.id),
            LastName: staffIdToLastName(clinic.staffInfos, user.id),
          },
          ReviewingOHIPPhysicianId: staffIdToOHIP(clinic.staffInfos, user.id),
          DateTimeReportReviewed: Date.now(),
        },
      ];

      await putPatientRecord(
        "/reports",
        item.id,
        user.id,
        auth.authToken,
        datasToPut,
        socket,
        "REPORTS"
      );

      socket.emit("message", {
        route: "DOCMAILBOX",
        action: "update",
        content: { id: item.id, data: datasToPut },
      });

      toast.success("Document acknowledged successfully", {
        containerId: "A",
      });
    } catch (err) {
      toast.error(`Unable to Acknowledge document : ${err.message}`, {
        containerId: "A",
      });
    }
  };

  const handleForward = () => {
    setForwardVisible(true);
    setUser({ ...user, docToForward: item });
  };

  return (
    <tr className="reports__item">
      <td>{item.Name}</td>
      <td>{item.Format}</td>
      <td>{item.FileExtensionAndVersion}</td>
      {item.Content.Media ? (
        <td
          className="reports__link"
          onClick={() =>
            showDocument(item.Content.Media.url, item.Content.Media.mime)
          }
        >
          {item.Content.Media.name}
        </td>
      ) : (
        <td>{item.Content.TextContent}</td>
      )}
      <td>
        <NavLink
          className="reports__link"
          to={`/patient-record/${item.patient_id}`}
          target="_blank"
        >
          {" "}
          {patientIdToName(clinic.demographicsInfos, item.patient_id)}
        </NavLink>
      </td>
      <td>{toLocalDate(item.EventDateTime)}</td>
      <td>{toLocalDate(item.ReceivedDateTime)}</td>
      <td>
        {item.SourceAuthorPhysician?.AuthorFreeText
          ? item.SourceAuthorPhysician.AuthorFreeText
          : item.SourceAuthorPhysician?.AuthorName?.FirstName
          ? `${item.SourceAuthorPhysician?.AuthorName?.FirstName} ${item.SourceAuthorPhysician?.AuthorName?.LastName}`
          : ""}
      </td>
      <td>{item.Notes}</td>
      <td>
        <em>
          {staffIdToTitleAndName(clinic.staffInfos, item.created_by_id, true)}
        </em>
      </td>
      <td>
        <em>{toLocalDate(item.date_created)}</em>
      </td>
      <td>
        <div className="reports__item-btn-container">
          <button onClick={handleAcknowledge}>Acknowledge</button>
          <button onClick={handleForward} disabled={forwardVisible}>
            Forward
          </button>
        </div>
      </td>
    </tr>
  );
};

export default DocMailboxItem;
