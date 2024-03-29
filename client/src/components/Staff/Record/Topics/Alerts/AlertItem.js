import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { alertSchema } from "../../../../../validation/record/alertValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import SignCell from "../../../../UI/Tables/SignCell";

const AlertItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef = null,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "DateActive" || name === "EndDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const formDatas = {
      ...itemInfos,
      AlertDescription: firstLetterOfFirstWordUpper(itemInfos.AlertDescription),
    };

    //Validation
    try {
      await alertSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      setProgress(true);
      await putPatientRecord(
        `/alerts/${item.id}`,
        user.id,
        formDatas,
        socket,
        "ALERTS & SPECIAL NEEDS"
      );

      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error unable to update alert: ${err.message}`, {
        containerId: "B",
      });
      setProgress(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setItemInfos(item);
    setEditVisible(false);
  };

  const handleEditClick = (e) => {
    editCounter.current += 1;
    setErrMsgPost("");
    setEditVisible((v) => !v);
  };

  const handleDeleteClick = async (e) => {
    setErrMsgPost("");
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        setProgress(true);
        await deletePatientRecord(
          "/alerts",
          item.id,
          socket,
          "ALERTS & SPECIAL NEEDS"
        );
        toast.success("Deleted successfully", { containerId: "B" });
        setProgress(false);
      } catch (err) {
        toast.error(`Error unable to delete alert: ${err.message}`, {
          containerId: "B",
        });
        setProgress(false);
      }
    }
  };

  return (
    itemInfos && (
      <tr
        className="alerts__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="alerts__item-btn-container">
            {!editVisible ? (
              <>
                <button onClick={handleEditClick}>Edit</button>
                <button onClick={handleDeleteClick}>Delete</button>
              </>
            ) : (
              <>
                <input
                  type="submit"
                  value="Save"
                  onClick={handleSubmit}
                  disabled={progress}
                />
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={progress}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </td>
        <td>
          {editVisible ? (
            <input
              name="AlertDescription"
              onChange={handleChange}
              type="text"
              value={itemInfos.AlertDescription}
              autoComplete="off"
            />
          ) : (
            itemInfos.AlertDescription
          )}
        </td>

        <td>
          {editVisible ? (
            <input
              name="DateActive"
              onChange={handleChange}
              type="date"
              value={timestampToDateISOTZ(
                itemInfos.DateActive,
                "America/Toronto"
              )}
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(itemInfos.DateActive, "America/Toronto")
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="EndDate"
              onChange={handleChange}
              type="date"
              value={timestampToDateISOTZ(itemInfos.EndDate, "America/Toronto")}
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(itemInfos.EndDate, "America/Toronto")
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Notes"
              onChange={handleChange}
              type="text"
              value={itemInfos.Notes}
              autoComplete="off"
            />
          ) : (
            itemInfos.Notes
          )}
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default AlertItem;
