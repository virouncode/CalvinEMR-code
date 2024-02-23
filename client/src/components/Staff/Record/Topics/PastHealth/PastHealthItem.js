import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import { lifeStageCT, toCodeTableName } from "../../../../../datas/codesTables";
import useAuthContext from "../../../../../hooks/useAuthContext";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { pastHealthSchema } from "../../../../../validation/pastHealthValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../../All/UI/Lists/GenericList";
import SignCell from "../SignCell";

const PastHealthItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef = null,
}) => {
  //HOOKS
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
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
    if (
      name === "ProcedureDate" ||
      name === "OnsetOrEventDate" ||
      name === "ResolvedDate"
    ) {
      value = value === "" ? null : Date.parse(new Date(value));
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
      await putPatientRecord(
        "/past_health",
        item.id,
        user.id,
        auth.authToken,
        formDatas,
        socket,
        "PAST HEALTH"
      );
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(
        `Error unable to update medical history item: ${err.message}`,
        { containerId: "B" }
      );
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
        await deletePatientRecord(
          "/past_health",
          item.id,
          auth.authToken,
          socket,
          "PAST HEALTH"
        );
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(
          `Error unable to delete medical history item: ${err.message}`,
          { containerId: "B" }
        );
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
              max={toLocalDate(Date.now())}
              value={toLocalDate(itemInfos.OnsetOrEventDate)}
              onChange={handleChange}
            />
          ) : (
            toLocalDate(itemInfos.OnsetOrEventDate)
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
              max={toLocalDate(Date.now())}
              value={toLocalDate(itemInfos.ProcedureDate)}
              onChange={handleChange}
            />
          ) : (
            toLocalDate(itemInfos.ProcedureDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ResolvedDate"
              type="date"
              max={toLocalDate(Date.now())}
              value={toLocalDate(itemInfos.ResolvedDate)}
              onChange={handleChange}
            />
          ) : (
            toLocalDate(itemInfos.ResolvedDate)
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
        <td>
          <div className="pasthealth__item-btn-container">
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

export default PastHealthItem;