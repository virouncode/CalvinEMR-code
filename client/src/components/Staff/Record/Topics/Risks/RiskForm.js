import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import { lifeStageCT } from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { riskSchema } from "../../../../../validation/riskValidation";
import GenericList from "../../../../All/UI/Lists/GenericList";

const RiskForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
}) => {
  //HOOKS
  const { auth, user, clinic, socket } = useAuth();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    RiskFactor: "",
    ExposureDetails: "",
    StartDate: null,
    EndDate: "",
    AgeOfOnset: null,
    LifeStage: "N",
    Notes: "",
  });

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "StartDate" || name === "EndDate") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPost = {
      ...formDatas,
      RiskFactor: firstLetterOfFirstWordUpper(formDatas.RiskFactor),
      ExposureDetails: firstLetterOfFirstWordUpper(formDatas.ExposureDetails),
      Notes: firstLetterOfFirstWordUpper(formDatas.Notes),
    };
    //Validation
    try {
      await riskSchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await postPatientRecord(
        "/risk_factors",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "RISK FACTORS"
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error unable to save risk factor: ${err.message}`, {
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
      className="risk__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <input
          type="text"
          value={formDatas.RiskFactor}
          onChange={handleChange}
          name="RiskFactor"
          autoComplete="off"
        />
      </td>
      <td>
        <input
          type="text"
          value={formDatas.ExposureDetails}
          onChange={handleChange}
          name="ExposureDetails"
          autoComplete="off"
        />
      </td>
      <td>
        <input
          type="date"
          max={toLocalDate(Date.now())}
          value={toLocalDate(formDatas.StartDate)}
          onChange={handleChange}
          name="StartDate"
          autoComplete="off"
        />
      </td>
      <td>
        <input
          type="date"
          max={toLocalDate(Date.now())}
          value={toLocalDate(formDatas.EndDate)}
          onChange={handleChange}
          name="EndDate"
          autoComplete="off"
        />
      </td>
      <td>
        <input
          type="text"
          value={formDatas.AgeOfOnset}
          onChange={handleChange}
          name="AgeOfOnset"
          autoComplete="off"
        />
      </td>
      <td>
        <GenericList
          list={lifeStageCT}
          value={formDatas.LifeStage}
          name="LifeStage"
          handleChange={handleChange}
          placeHolder="Choose a lifestage..."
        />
      </td>
      <td>
        <input
          type="text"
          value={formDatas.Notes}
          onChange={handleChange}
          name="Notes"
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
        <div className="risk__form-btn-container">
          <input type="submit" value="Save" onClick={handleSubmit} />
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
};

export default RiskForm;
