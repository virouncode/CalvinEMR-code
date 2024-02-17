import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { putPatientRecord } from "../../../api/fetchRecords";
import useAuthContext from "../../../hooks/useAuthContext";
import { toLocalDate } from "../../../utils/formatDates";
import { patientIdToName } from "../../../utils/patientIdToName";
import { showDocument } from "../../../utils/showDocument";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../utils/staffIdToName";
import SignCell from "../Record/Topics/SignCell";

const DocMailboxItem = ({ item, setForwardVisible, forwardVisible }) => {
  const { clinic, auth, user, setUser, socket } = useAuthContext();

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
      <td>{item.name}</td>
      <td>{item.Format}</td>
      <td>{item.FileExtensionAndVersion}</td>
      {item.File ? (
        <td
          className="reports__link"
          onClick={() => showDocument(item.File.url, item.File.mime)}
        >
          {item.File.name}
        </td>
      ) : (
        <td>{item.Content.TextContent}</td>
      )}
      <td>
        <NavLink
          className="reports__link"
          to={`/staff/patient-record/${item.patient_id}`}
          target="_blank"
        >
          {" "}
          {patientIdToName(clinic.demographicsInfos, item.patient_id)}
        </NavLink>
      </td>
      <td>{item.Class}</td>
      <td>{item.SubClass}</td>
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
      <SignCell item={item} staffInfos={clinic.staffInfos} />
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
