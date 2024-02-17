import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import {
  lifeStageCT,
  propertyOfOffendingAgentCT,
  reactionSeverityCT,
  reactionTypeCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";
import useAuthContext from "../../../../../hooks/useAuthContext";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { allergySchema } from "../../../../../validation/allergyValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../../All/UI/Lists/GenericList";
import SignCell from "../SignCell";

const AllergyItem = ({ item, editCounter, setErrMsgPost, errMsgPost }) => {
  //HOOKS
  const { auth, user, clinic, socket } = useAuthContext();
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
    if (name === "StartDate" || name === "RecordedDate") {
      value = value === "" ? null : Date.parse(new Date(value));
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
      await putPatientRecord(
        "/allergies",
        item.id,
        user.id,
        auth.authToken,
        datasToPut,
        socket,
        "ALLERGIES & ADVERSE REACTIONS"
      );
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to update allergy: ${err.message}`, {
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
          "/allergies",
          item.id,
          auth.authToken,
          socket,
          "ALLERGIES & ADVERSE REACTIONS"
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
    itemInfos && (
      <tr
        className="allergies__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
      >
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
              value={toLocalDate(itemInfos.StartDate)}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            toLocalDate(item.StartDate)
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
        <td>{toLocalDate(itemInfos.RecordedDate)}</td>
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
        <SignCell item={item} staffInfos={clinic.staffInfos} />
        <td>
          <div className="allergies__item-btn-container">
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

export default AllergyItem;
