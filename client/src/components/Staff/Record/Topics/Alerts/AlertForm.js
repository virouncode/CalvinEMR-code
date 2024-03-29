import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { alertSchema } from "../../../../../validation/record/alertValidation";

const AlertForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    AlertDescription: "",
    DateActive: nowTZTimestamp(),
    Notes: "",
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "DateActive" || name === "EndDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPost = {
      ...formDatas,
      AlertDescription: firstLetterOfFirstWordUpper(formDatas.AlertDescription),
    };
    //Validation
    try {
      await alertSchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    try {
      setProgress(true);
      await postPatientRecord(
        "/alerts",
        user.id,

        datasToPost,
        socket,
        "ALERTS & SPECIAL NEEDS"
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error unable to save ongoing concern: ${err.message}`, {
        containerId: "B",
      });
      setProgress(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr
      className="alerts__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="alerts__form-btn-container">
          <input
            type="submit"
            value="Save"
            onClick={handleSubmit}
            disabled={progress}
          />
          <button type="button" onClick={handleCancel} disabled={progress}>
            Cancel
          </button>
        </div>
      </td>
      <td>
        <input
          name="AlertDescription"
          onChange={handleChange}
          type="text"
          value={formDatas.AlertDescription}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="DateActive"
          onChange={handleChange}
          type="date"
          value={timestampToDateISOTZ(formDatas.DateActive, "America/Toronto")}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="EndDate"
          onChange={handleChange}
          type="date"
          value={timestampToDateISOTZ(formDatas.EndDate, "America/Toronto")}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="Notes"
          onChange={handleChange}
          type="text"
          value={formDatas.Notes}
          autoComplete="off"
        />
      </td>
      <td>
        <em>{staffIdToTitleAndName(staffInfos, user.id)}</em>
      </td>
      <td>
        <em>{timestampToDateISOTZ(nowTZTimestamp())}</em>
      </td>
    </tr>
  );
};

export default AlertForm;
