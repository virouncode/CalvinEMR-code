import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import { lifeStageCT, toCodeTableName } from "../../../../../datas/codesTables";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/formatDates";
import { famHistorySchema } from "../../../../../validation/famHistoryValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../../All/UI/Lists/GenericList";
import RelativesList from "../../../../All/UI/Lists/RelativesList";
import SignCell from "../SignCell";

const FamHistoryItem = ({
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
    if (name === "StartDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const formDatas = {
      ...itemInfos,
      ProblemDiagnosisProcedureDescription: firstLetterOfFirstWordUpper(
        itemInfos.ProblemDiagnosisProcedureDescription
      ),
      Treatment: firstLetterOfFirstWordUpper(itemInfos.Treatment),
      Notes: firstLetterOfFirstWordUpper(itemInfos.Notes),
    };

    //Validation
    try {
      await famHistorySchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      setProgress(true);
      await putPatientRecord(
        `/family_history/${item.id}`,
        user.id,
        formDatas,
        socket,
        "FAMILY HISTORY"
      );
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(
        `Error unable to update family history item: ${err.message}`,
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

  const handleMemberChange = (value) => {
    setItemInfos({ ...itemInfos, Relationship: value });
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
          "/family_history",
          item.id,

          socket,
          "FAMILY HISTORY"
        );
        toast.success("Deleted successfully", { containerId: "B" });
        setProgress(false);
      } catch (err) {
        toast.error(
          `Error unable to delete family history item: ${err.message}`,
          { containerId: "B" }
        );
        setProgress(false);
      }
    }
  };

  return (
    itemInfos && (
      <tr
        className="famhistory__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="famhistory__item-btn-container">
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
              name="ProblemDiagnosisProcedureDescription"
              type="text"
              value={itemInfos.ProblemDiagnosisProcedureDescription}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.ProblemDiagnosisProcedureDescription
          )}
        </td>
        <td>
          {editVisible ? (
            <RelativesList
              handleChange={handleMemberChange}
              value={itemInfos.Relationship}
            />
          ) : (
            itemInfos.Relationship
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="date"
              max={timestampToDateISOTZ(nowTZTimestamp())}
              name="StartDate"
              value={timestampToDateISOTZ(itemInfos.StartDate)}
              onChange={handleChange}
            />
          ) : (
            timestampToDateISOTZ(itemInfos.StartDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="AgeAtOnset"
              value={itemInfos.AgeAtOnset}
              onChange={handleChange}
            />
          ) : (
            itemInfos.AgeAtOnset
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
              type="text"
              name="Treatment"
              value={itemInfos.Treatment}
              onChange={handleChange}
            />
          ) : (
            itemInfos.Treatment
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="Notes"
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

export default FamHistoryItem;
