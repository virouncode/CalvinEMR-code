import React from "react";
import { toast } from "react-toastify";
import { deletePatientRecord } from "../../../../../api/fetchRecords";
import useAuthContext from "../../../../../hooks/useAuthContext";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { toLocalDate } from "../../../../../utils/formatDates";
import { showDocument } from "../../../../../utils/showDocument";
import { showReportTextContent } from "../../../../../utils/showReportTextContent";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import SignCell from "../SignCell";

const ReportItemSent = ({ item, lastItemSentRef = null }) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
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
          "REPORTS SENT"
        );
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error unable to delete document: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  return (
    <tr className="reports__item" ref={lastItemSentRef}>
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
      <td>{toLocalDate(item.DateTimeSent)}</td>
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
      <td>
        <div className="reports__item-btn-container">
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

export default ReportItemSent;
