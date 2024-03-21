import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { timestampToDateISOTZ } from "../../../utils/formatDates";
import { showDocument } from "../../../utils/showDocument";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";

const ReferenceEdocItem = ({
  item,
  setErrMsgPost,
  errMsgPost,
  lastItemRef = null,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [progress, setProgress] = useState(false);

  const handleDeleteClick = async () => {
    setErrMsgPost("");
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        setProgress(true);
        await xanoDelete(`/edocs/${item.id}`, "staff");
        socket.emit("message", {
          route: "EDOCS",
          action: "delete",
          content: { id: item.id },
        });
        toast.success("Deleted successfully", { containerId: "B" });
        setProgress(false);
      } catch (err) {
        toast.error(
          `Error unable to delete medical history item: ${err.message}`,
          { containerId: "B" }
        );
        setProgress(false);
      }
    }
  };

  return (
    item && (
      <tr
        className="reference-edocs__item"
        style={{ border: errMsgPost && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="reference-edocs__item-btn-container">
            <button
              onClick={handleDeleteClick}
              disabled={progress || item.created_by_id !== user.id}
            >
              Delete
            </button>
          </div>
        </td>
        <td>{item.name}</td>
        <td
          className="reference-edocs__item-link"
          onClick={() => showDocument(item.file?.url, item.file?.mime)}
        >
          {item.file.name}
        </td>
        <td>{item.notes}</td>
        <td>{staffIdToTitleAndName(staffInfos, item.created_by_id)}</td>
        <td>{timestampToDateISOTZ(item.date_created)}</td>
      </tr>
    )
  );
};

export default ReferenceEdocItem;
