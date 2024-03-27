import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { timestampToDateISOTZ } from "../../../utils/dates/formatDates";
import { showDocument } from "../../../utils/files/showDocument";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { edocSchema } from "../../../validation/reference/edocValidation";
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
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState({});

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleEditClick = () => {
    setErrMsgPost("");
    setEditVisible(true);
  };
  const handleCancelClick = () => {
    setErrMsgPost("");
    setEditVisible(false);
  };
  const handleSaveClick = async () => {
    setErrMsgPost("");
    //Validation
    try {
      await edocSchema.validate(itemInfos);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    if (!itemInfos.file) {
      setErrMsgPost("Please upload a file");
      return;
    }
    try {
      setProgress(true);
      const response = await xanoPut(`/edocs/${item.id}`, "staff", itemInfos);
      socket.emit("message", {
        route: "EDOCS",
        action: "create",
        content: { data: response.data },
      });
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "A" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error unable to save document: ${err.message}`, {
        containerId: "A",
      });
      setProgress(false);
    }
  };
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
            {editVisible ? (
              <>
                <button
                  onClick={handleSaveClick}
                  disabled={progress || item.created_by_id !== user.id}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelClick}
                  disabled={progress || item.created_by_id !== user.id}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditClick}
                  disabled={progress || item.created_by_id !== user.id}
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  disabled={progress || item.created_by_id !== user.id}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </td>
        <td style={{ textAlign: "left" }}>
          {editVisible ? (
            <input
              type="text"
              value={itemInfos.name}
              onChange={handleChange}
              name="name"
            />
          ) : (
            item.name
          )}
        </td>
        <td
          className="reference-edocs__item-link"
          onClick={() => showDocument(item.file?.url, item.file?.mime)}
        >
          {item.file.name}
        </td>
        <td style={{ textAlign: "left" }}>
          {editVisible ? (
            <input
              type="text"
              value={itemInfos.notes}
              onChange={handleChange}
              name="notes"
            />
          ) : (
            item.notes
          )}
        </td>
        <td>{staffIdToTitleAndName(staffInfos, item.created_by_id)}</td>
        <td>{timestampToDateISOTZ(item.date_created)}</td>
      </tr>
    )
  );
};

export default ReferenceEdocItem;
