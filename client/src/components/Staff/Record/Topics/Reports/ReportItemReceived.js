import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../../hooks/useUserContext";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/formatDates";
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
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [progress, setProgress] = useState(false);
  const handleDeleteClick = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        setProgress(true);
        await deletePatientRecord(
          "/reports",
          item.id,

          socket,
          "REPORTS RECEIVED"
        );
        socket.emit("message", {
          route: "REPORTS INBOX",
          action: "delete",
          content: { id: item.id },
        });
        toast.success("Deleted successfully", { containerId: "B" });
        setProgress(false);
      } catch (err) {
        toast.error(`Error unable to delete document: ${err.message}`, {
          containerId: "B",
        });
        setProgress(false);
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
          DateTimeReportReviewed: nowTZTimestamp(),
        },
      ];
      setProgress(true);
      await putPatientRecord(
        `/reports/${item.id}`,
        user.id,
        datasToPut,
        socket,
        "REPORTS RECEIVED"
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

  return (
    <tr className="reports__item" ref={lastItemReceivedRef}>
      <td>
        <div className="reports__item-btn-container">
          {" "}
          {!item.acknowledged && item.assigned_staff_id === user.id && (
            <button onClick={handleAcknowledge} disabled={progress}>
              Acknowledge
            </button>
          )}
          <button disabled={progress}>Fax</button>
          <button
            onClick={handleDeleteClick}
            disabled={user.id !== item.assigned_staff_id || progress}
          >
            Delete
          </button>
        </div>
      </td>
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
      <td>{timestampToDateISOTZ(item.EventDateTime)}</td>
      <td>{timestampToDateISOTZ(item.ReceivedDateTime)}</td>
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
                  {timestampToDateISOTZ(review.DateTimeReportReviewed)}
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
      <td>{timestampToDateISOTZ(item.DateTimeSent)}</td> */}
      <SignCell item={item} />
    </tr>
  );
};

export default ReportItemReceived;
