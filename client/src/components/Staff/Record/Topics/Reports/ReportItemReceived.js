import React from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import useAuthContext from "../../../../../hooks/useAuthContext";
import { toLocalDate } from "../../../../../utils/formatDates";
import { showDocument } from "../../../../../utils/showDocument";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../../utils/staffIdToName";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import SignCell from "../SignCell";

const ReportItemReceived = ({ item, setErrMsgPost }) => {
  const { auth, clinic, user, socket } = useAuthContext();
  const handleDeleteClick = async (e) => {
    setErrMsgPost("");
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        await deletePatientRecord(
          "/reports",
          item.id,
          auth.authToken,
          socket,
          "REPORTS"
        );
        socket.emit("message", {
          route: "DOCMAILBOX",
          action: "delete",
          content: { id: item.id },
        });
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error unable to delete document: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

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
      toast.error(`Unable to acknowledge document : ${err.message}`, {
        containerId: "A",
      });
    }
  };

  return (
    <tr className="reports__item">
      <td>{item.name}</td>
      <td>{item.Format}</td>
      <td>{item.FileExtensionAndVersion}</td>
      {item.Format === "Binary" ? (
        <td
          className="reports__link"
          onClick={() => showDocument(item.File.url, item.File.mime)}
          style={{
            fontWeight: item.ReportReviewed.length ? "normal" : "bold",
            color: item.ReportReviewed.length ? "black" : "blue",
          }}
        >
          {item.File.name}
        </td>
      ) : (
        <td>{item.Content.TextContent}</td>
      )}
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
      <td>
        {item.ReportReviewed.length
          ? item.ReportReviewed.map((review) =>
              review?.Name?.FirstName ? (
                <span key={review.Name.LastName}>
                  {review.Name?.FirstName || ""} {review.Name?.LastName || ""}{" "}
                  {review.ReviewingOHIPPhysicianId || ""}
                </span>
              ) : null
            )
          : ""}
      </td>
      <td>
        {item.ReportReviewed.length
          ? item.ReportReviewed.map((review) =>
              review?.DateTimeReportReviewed ? (
                <span key={review.DateTimeReportReviewed}>
                  {toLocalDate(review.DateTimeReportReviewed)}
                </span>
              ) : null
            )
          : ""}
      </td>
      <td>{item.Notes}</td>
      {/* <td>
        {item.RecipientName?.FirstName || ""}{" "}
        {item.RecipientName?.LastName || ""}
      </td>
      <td>{toLocalDate(item.DateTimeSent)}</td> */}
      <SignCell item={item} staffInfos={clinic.staffInfos} />
      <td>
        <div className="reports__item-btn-container">
          {" "}
          {!item.acknowledged && item.assigned_staff_id === user.id && (
            <button onClick={handleAcknowledge}>Acknowledge</button>
          )}
          <button>Fax</button>
          <button
            onClick={handleDeleteClick}
            disabled={user.id !== item.assigned_staff_id}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReportItemReceived;
