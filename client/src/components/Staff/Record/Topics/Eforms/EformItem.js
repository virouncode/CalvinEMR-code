import React from "react";
import { toast } from "react-toastify";
import { deletePatientRecord } from "../../../../../api/fetchRecords";
import useAuth from "../../../../../hooks/useAuth";
import { toLocalDate } from "../../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";

const EformItem = ({ item, showDocument }) => {
  //HOOKS
  const { auth, clinic, socket } = useAuth();

  const handleDeleteClick = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        await deletePatientRecord(
          "/eforms",
          item.id,
          auth.authToken,
          socket,
          "E-FORMS"
        );
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error: unable to delete item: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  return (
    <tr className="eforms__item">
      <td
        className="eforms__link"
        onClick={() => showDocument(item.file.url, item.file.mime)}
      >
        {item.name}
      </td>
      <td>
        <em>
          {staffIdToTitleAndName(clinic.staffInfos, item.created_by_id, true)}
        </em>
      </td>
      <td>
        <em>{toLocalDate(item.date_created)}</em>
      </td>
      <td>
        <div className="eforms__item-btn-container">
          <button>Fax</button>
          <button onClick={handleDeleteClick}>Delete</button>
        </div>
      </td>
    </tr>
  );
};

export default EformItem;
