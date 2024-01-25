import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import useAuth from "../../../../../hooks/useAuth";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { alertSchema } from "../../../../../validation/alertValidation";

const AlertForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
}) => {
  //HOOKS
  const { auth, user, socket, clinic } = useAuth();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    DateActive: Date.now(),
  });

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "DateActive" || name === "EndDate") {
      value = value === "" ? null : Date.parse(new Date(value));
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
      await postPatientRecord(
        "/alerts",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "ALERTS & SPECIAL NEEDS"
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error unable to save ongoing concern: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr
      className="alerts__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
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
          value={toLocalDate(formDatas.DateActive)}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="EndDate"
          onChange={handleChange}
          type="date"
          value={toLocalDate(formDatas.EndDate)}
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
        <em>{staffIdToTitleAndName(clinic.staffInfos, user.id, true)}</em>
      </td>
      <td>
        <em>{toLocalDate(Date.now())}</em>
      </td>
      <td>
        <div className="alerts__form-btn-container">
          <input type="submit" value="Save" onClick={handleSubmit} />
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AlertForm;
