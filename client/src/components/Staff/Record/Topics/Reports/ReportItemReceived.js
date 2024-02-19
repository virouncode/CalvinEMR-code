import React from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import useAuthContext from "../../../../../hooks/useAuthContext";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { toLocalDate } from "../../../../../utils/formatDates";
import { showDocument } from "../../../../../utils/showDocument";
import { showReportTextContent } from "../../../../../utils/showReportTextContent";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../../utils/staffIdToName";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import SignCell from "../SignCell";

const ReportItemReceived = ({ item, lastItemReceivedRef = null }) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const handleDeleteClick = async (e) => {
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
          "REPORTS RECEIVED"
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
            FirstName: staffIdToFirstName(staffInfos, user.id),
            LastName: staffIdToLastName(staffInfos, user.id),
          },
          ReviewingOHIPPhysicianId: staffIdToOHIP(staffInfos, user.id),
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
        "REPORTS RECEIVED"
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
    <tr className="reports__item" ref={lastItemReceivedRef}>
      {console.log("item", item)}
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
      <SignCell item={item} />
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
