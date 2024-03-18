import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import { lifeStageCT } from "../../../../../datas/codesTables";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/formatDates";
import { problemListSchema } from "../../../../../validation/problemListValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../../All/UI/Lists/GenericList";
import SignCell from "../SignCell";

const ProblemListItem = ({
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
    if (name === "OnsetDate" || name === "ResolutionDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPut = {
      ...itemInfos,
      ProblemDiagnosisDescription: firstLetterOfFirstWordUpper(
        itemInfos.ProblemDiagnosisDescription
      ),
      ProblemDescription: firstLetterOfFirstWordUpper(
        itemInfos.ProblemDescription
      ),
      ProblemStatus: firstLetterOfFirstWordUpper(itemInfos.ProblemStatus),
      Notes: firstLetterOfFirstWordUpper(itemInfos.Notes),
    };
    //Validation
    try {
      await problemListSchema.validate(datasToPut);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      setProgress(true);
      await putPatientRecord(
        `/problemlist/${item.id}`,
        user.id,
        datasToPut,
        socket,
        "PROBLEM LIST"
      );
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error: unable to update problem list: ${err.message}`, {
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
          "/problemlist",
          item.id,

          socket,
          "PROBLEM LIST"
        );

        toast.success("Deleted successfully", { containerId: "B" });
        setProgress(false);
      } catch (err) {
        toast.error(
          `Error: unable to delete problem list item: ${err.message}`,
          {
            containerId: "B",
          }
        );
        setProgress(false);
      }
    }
  };

  return (
    itemInfos && (
      <tr
        className="problemlist__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="problemlist__item-btn-container">
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
              name="ProblemDiagnosisDescription"
              type="text"
              value={itemInfos.ProblemDiagnosisDescription}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.ProblemDiagnosisDescription
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ProblemDescription"
              type="text"
              value={itemInfos.ProblemDescription}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.ProblemDescription
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ProblemStatus"
              type="text"
              value={itemInfos.ProblemStatus}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.ProblemStatus
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="OnsetDate"
              type="date"
              value={timestampToDateISOTZ(itemInfos.OnsetDate)}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(itemInfos.OnsetDate)
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
            lifeStageCT.find(({ code }) => code === itemInfos.LifeStage)?.name
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ResolutionDate"
              type="date"
              value={timestampToDateISOTZ(itemInfos.ResolutionDate)}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(itemInfos.ResolutionDate)
          )}
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
            itemInfos.Notes
          )}
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default ProblemListItem;
