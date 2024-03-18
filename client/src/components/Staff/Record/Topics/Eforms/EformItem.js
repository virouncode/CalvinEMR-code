import React, { useState } from "react";
import { toast } from "react-toastify";
import { deletePatientRecord } from "../../../../../api/fetchRecords";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import { timestampToDateISOTZ } from "../../../../../utils/formatDates";
import { showDocument } from "../../../../../utils/showDocument";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";

const EformItem = ({ item, lastItemRef = null }) => {
  //HOOKS
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
          "/eforms",
          item.id,

          socket,
          "E-FORMS"
        );
        toast.success("Deleted successfully", { containerId: "B" });
        setProgress(false);
      } catch (err) {
        toast.error(`Error: unable to delete item: ${err.message}`, {
          containerId: "B",
        });
        setProgress(false);
      }
    }
  };

  return (
    <tr className="eforms__item" ref={lastItemRef}>
      <td>
        <div className="eforms__item-btn-container">
          <button disabled={progress}>Fax</button>
          <button onClick={handleDeleteClick} disabled={progress}>
            Delete
          </button>
        </div>
      </td>
      <td
        className="eforms__link"
        onClick={() => showDocument(item.file.url, item.file.mime)}
      >
        {item.name}
      </td>
      <td>
        <em>{staffIdToTitleAndName(staffInfos, item.created_by_id)}</em>
      </td>
      <td>
        <em>{timestampToDateISOTZ(item.date_created)}</em>
      </td>
    </tr>
  );
};

export default EformItem;
