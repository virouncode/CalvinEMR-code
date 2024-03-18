import React, { useState } from "react";
import { toast } from "react-toastify";
import { deletePatientRecord } from "../../../../../api/fetchRecords";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { timestampToDateISOTZ } from "../../../../../utils/formatDates";
import { showDocument } from "../../../../../utils/showDocument";
import { showReportTextContent } from "../../../../../utils/showReportTextContent";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import SignCell from "../SignCell";

const ReportItemSent = ({ item, lastItemSentRef = null }) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
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
          "REPORTS SENT"
        );
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

  return (
    <tr className="reports__item" ref={lastItemSentRef}>
      <td>
        <div className="reports__item-btn-container">
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
      <td>{timestampToDateISOTZ(item.DateTimeSent)}</td>
      <td>
        {item.SourceAuthorPhysician?.AuthorFreeText
          ? item.SourceAuthorPhysician.AuthorFreeText
          : item.SourceAuthorPhysician?.AuthorName?.FirstName
          ? `${item.SourceAuthorPhysician?.AuthorName?.FirstName} ${item.SourceAuthorPhysician?.AuthorName?.LastName}`
          : ""}
      </td>
      <td>
        {item.RecipientName?.FirstName} {item.RecipientName?.LastName}
      </td>
      <td>{item.Notes}</td>
      <SignCell item={item} />
    </tr>
  );
};

export default ReportItemSent;
