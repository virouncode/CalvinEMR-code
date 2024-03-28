import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  lifeStageCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { pastHealthSchema } from "../../../../../validation/record/pastHealthValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../../UI/Lists/GenericList";
import SignCell from "../../../../UI/Tables/SignCell";

const PastHealthItem = ({
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
    if (
      name === "ProcedureDate" ||
      name === "OnsetOrEventDate" ||
      name === "ResolvedDate"
    ) {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const formDatas = {
      ...itemInfos,
      PastHealthProblemDescriptionOrProcedures: firstLetterOfFirstWordUpper(
        itemInfos.PastHealthProblemDescriptionOrProcedures
      ),
      ProblemStatus: firstLetterOfFirstWordUpper(itemInfos.ProblemStatus),
      Notes: firstLetterOfFirstWordUpper(itemInfos.Notes),
    };

    //Validation
    try {
      await pastHealthSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      setProgress(true);
      await putPatientRecord(
        `/past_health/${item.id}`,
        user.id,
        formDatas,
        socket,
        "PAST HEALTH"
      );
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(
        `Error unable to update medical history item: ${err.message}`,
        { containerId: "B" }
      );
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
    setEditVisible(true);
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
          "/past_health",
          item.id,
          socket,
          "PAST HEALTH"
        );
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
    itemInfos && (
      <tr
        className="pasthealth__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="pasthealth__item-btn-container">
            {!editVisible ? (
              <>
                <button onClick={handleEditClick} disabled={progress}>
                  Edit
                </button>
                <button onClick={handleDeleteClick} disabled={progress}>
                  Delete
                </button>
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
              name="PastHealthProblemDescriptionOrProcedures"
              type="text"
              value={itemInfos.PastHealthProblemDescriptionOrProcedures}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.PastHealthProblemDescriptionOrProcedures
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="OnsetOrEventDate"
              type="date"
              max={timestampToDateISOTZ(nowTZTimestamp())}
              value={timestampToDateISOTZ(itemInfos.OnsetOrEventDate)}
              onChange={handleChange}
            />
          ) : (
            timestampToDateISOTZ(itemInfos.OnsetOrEventDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericList
              list={lifeStageCT}
              value={itemInfos.LifeStage}
              name="LifeStage"
              handleChange={handleChange}
              placeHolder="Choose a lifestage..."
              noneOption={false}
            />
          ) : (
            toCodeTableName(lifeStageCT, itemInfos.LifeStage)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ProcedureDate"
              type="date"
              max={timestampToDateISOTZ(nowTZTimestamp())}
              value={timestampToDateISOTZ(itemInfos.ProcedureDate)}
              onChange={handleChange}
            />
          ) : (
            timestampToDateISOTZ(itemInfos.ProcedureDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ResolvedDate"
              type="date"
              max={timestampToDateISOTZ(nowTZTimestamp())}
              value={timestampToDateISOTZ(itemInfos.ResolvedDate)}
              onChange={handleChange}
            />
          ) : (
            timestampToDateISOTZ(itemInfos.ResolvedDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ProblemStatus"
              type="text"
              value={itemInfos.ProblemStatus}
              onChange={handleChange}
            />
          ) : (
            itemInfos.ProblemStatus
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Notes"
              type="text"
              value={itemInfos.Notes}
              onChange={handleChange}
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

export default PastHealthItem;
