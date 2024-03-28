import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  lifeStageCT,
  propertyOfOffendingAgentCT,
  reactionSeverityCT,
  reactionTypeCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { allergySchema } from "../../../../../validation/record/allergyValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../../UI/Lists/GenericList";
import SignCell from "../../../../UI/Tables/SignCell";

const AllergyItem = ({
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
    if (name === "StartDate" || name === "RecordedDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPut = {
      ...itemInfos,
      OffendingAgentDescription: firstLetterOfFirstWordUpper(
        itemInfos.OffendingAgentDescription
      ),
      Reaction: firstLetterOfFirstWordUpper(itemInfos.Reaction),
      Notes: firstLetterOfFirstWordUpper(itemInfos.Notes),
    };
    //Validation
    try {
      await allergySchema.validate(datasToPut);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      setProgress(true);
      await putPatientRecord(
        `/allergies/${item.id}`,
        user.id,
        datasToPut,
        socket,
        "ALLERGIES & ADVERSE REACTIONS"
      );
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error: unable to update allergy: ${err.message}`, {
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
          "/allergies",
          item.id,

          socket,
          "ALLERGIES & ADVERSE REACTIONS"
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
    itemInfos && (
      <tr
        className="allergies__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="allergies__item-btn-container">
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
              name="OffendingAgentDescription"
              type="text"
              value={itemInfos.OffendingAgentDescription}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.OffendingAgentDescription
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericList
              list={propertyOfOffendingAgentCT}
              value={itemInfos.PropertyOfOffendingAgent}
              name="PropertyOfOffendingAgent"
              handleChange={handleChange}
            />
          ) : (
            toCodeTableName(
              propertyOfOffendingAgentCT,
              item.PropertyOfOffendingAgent
            )
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericList
              list={reactionTypeCT}
              value={itemInfos.ReactionType}
              name="ReactionType"
              handleChange={handleChange}
            />
          ) : (
            toCodeTableName(reactionTypeCT, item.ReactionType)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="StartDate"
              type="date"
              value={timestampToDateISOTZ(
                itemInfos.StartDate,
                "America/Toronto"
              )}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(item.StartDate, "America/Toronto")
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericList
              list={lifeStageCT}
              value={itemInfos.LifeStage}
              name="LifeStage"
              handleChange={handleChange}
            />
          ) : (
            toCodeTableName(lifeStageCT, item.LifeStage)
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericList
              list={reactionSeverityCT}
              value={itemInfos.Severity}
              name="Severity"
              handleChange={handleChange}
            />
          ) : (
            toCodeTableName(reactionSeverityCT, item.Severity)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Reaction"
              type="text"
              value={itemInfos.Reaction}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.Reaction
          )}
        </td>
        <td>
          {timestampToDateISOTZ(itemInfos.RecordedDate, "America/Toronto")}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Notes"
              type="text"
              value={itemInfos.Notes}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.Notes
          )}
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default AllergyItem;
