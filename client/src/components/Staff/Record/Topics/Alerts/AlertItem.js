import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import useAuth from "../../../../../hooks/useAuth";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { alertSchema } from "../../../../../validation/alertValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import SignCell from "../SignCell";

const AlertItem = ({ item, editCounter, setErrMsgPost, errMsgPost }) => {
  //HOOKS
  const { auth, user, clinic, socket } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "DateActive" || name === "EndDate") {
      value = value === "" ? null : Date.parse(new Date(value));
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
      await putPatientRecord(
        "/alerts",
        item.id,
        user.id,
        auth.authToken,
        formDatas,
        socket,
        "ALERTS & SPECIAL NEEDS"
      );

      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error unable to update alert: ${err.message}`, {
        containerId: "B",
      });
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
        await deletePatientRecord(
          "/alerts",
          item.id,
          auth.authToken,
          socket,
          "ALERTS & SPECIAL NEEDS"
        );
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error unable to delete alert: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  return (
    itemInfos && (
      <tr
        className="alerts__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
      >
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
        <td>
          {editVisible ? (
            <input
              name="DateActive"
              onChange={handleChange}
              type="date"
              value={toLocalDate(itemInfos.DateActive)}
              autoComplete="off"
            />
          ) : (
            toLocalDate(itemInfos.DateActive)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="EndDate"
              onChange={handleChange}
              type="date"
              value={toLocalDate(itemInfos.EndDate)}
              autoComplete="off"
            />
          ) : (
            toLocalDate(itemInfos.EndDate)
          )}
        </td>
        <SignCell item={item} staffInfos={clinic.staffInfos} />
        <td>
          <div className="alerts__item-btn-container">
            {!editVisible ? (
              <>
                <button onClick={handleEditClick}>Edit</button>
                <button onClick={handleDeleteClick}>Delete</button>
              </>
            ) : (
              <>
                <input type="submit" value="Save" onClick={handleSubmit} />
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    )
  );
};

export default AlertItem;
