import React from "react";
import { toast } from "react-toastify";
import { deletePatientRecord } from "../../../../../api/fetchRecords";
import useAuthContext from "../../../../../hooks/useAuthContext";
import { toLocalDate } from "../../../../../utils/formatDates";
import { showDocument } from "../../../../../utils/showDocument";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import SignCell from "../SignCell";

const ReportItemSent = ({ item, setErrMsgPost }) => {
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
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error unable to delete document: ${err.message}`, {
          containerId: "B",
        });
      }
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
      <SignCell item={item} staffInfos={clinic.staffInfos} />
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
