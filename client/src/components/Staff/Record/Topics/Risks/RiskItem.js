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
import { riskSchema } from "../../../../../validation/record/riskValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../../UI/Lists/GenericList";
import SignCell from "../../../../UI/Tables/SignCell";

const RiskItem = ({
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
    if (name === "StartDate" || name === "EndDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const formDatas = {
      ...itemInfos,
      RiskFactor: firstLetterOfFirstWordUpper(itemInfos.RiskFactor),
      ExposureDetails: firstLetterOfFirstWordUpper(itemInfos.ExposureDetails),
      Notes: firstLetterOfFirstWordUpper(itemInfos.Notes),
    };
    //Validation
    try {
      await riskSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      setProgress(true);
      await putPatientRecord(
        `/risk_factors/${item.id}`,
        user.id,
        formDatas,
        socket,
        "RISK FACTORS"
      );
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error unable to update risk factor: ${err.message}`, {
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
          "/risk_factors",
          item.id,

          socket,
          "RISK FACTORS"
        );
        toast.success("Deleted successfully", { containerId: "B" });
        setProgress(false);
      } catch (err) {
        toast.error(`Error unable to delete risk factor: ${err.message}`, {
          containerId: "B",
        });
        setProgress(false);
      }
    }
  };

  return (
    itemInfos && (
      <tr
        className="risk__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="risk__item-btn-container">
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
              type="text"
              value={itemInfos.RiskFactor}
              onChange={handleChange}
              name="RiskFactor"
              autoComplete="off"
            />
          ) : (
            itemInfos.RiskFactor
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              value={itemInfos.ExposureDetails}
              onChange={handleChange}
              name="ExposureDetails"
              autoComplete="off"
            />
          ) : (
            itemInfos.ExposureDetails
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="date"
              max={timestampToDateISOTZ(nowTZTimestamp())}
              value={timestampToDateISOTZ(itemInfos.StartDate)}
              onChange={handleChange}
              name="StartDate"
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(itemInfos.StartDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="date"
              max={timestampToDateISOTZ(nowTZTimestamp())}
              value={timestampToDateISOTZ(itemInfos.EndDate)}
              onChange={handleChange}
              name="EndDate"
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(itemInfos.EndDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              value={itemInfos.AgeOfOnset}
              onChange={handleChange}
              name="AgeOfOnset"
              autoComplete="off"
            />
          ) : (
            itemInfos.AgeOfOnset
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
              value={itemInfos.Notes}
              onChange={handleChange}
              name="Notes"
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

export default RiskItem;
