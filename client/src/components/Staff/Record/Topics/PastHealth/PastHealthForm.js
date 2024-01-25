import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import { lifeStageCT } from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { pastHealthSchema } from "../../../../../validation/pastHealthValidation";
import GenericList from "../../../../All/UI/Lists/GenericList";

const PastHealthForm = ({
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
    PastHealthProblemDescriptionOrProcedures: "",
    OnsetOrEventDate: null,
    LifeStage: "A",
    ProcedureDate: null,
    ResolvedDate: null,
    ProblemStatus: "",
    Notes: "",
  });

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (
      name === "ProcedureDate" ||
      name === "OnsetOrEventDate" ||
      name === "ResolvedDate"
    ) {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPost = {
      ...formDatas,
      PastHealthProblemDescriptionOrProcedures: firstLetterOfFirstWordUpper(
        formDatas.PastHealthProblemDescriptionOrProcedures
      ),
      ProblemStatus: firstLetterOfFirstWordUpper(formDatas.ProblemStatus),
      Notes: firstLetterOfFirstWordUpper(formDatas.Notes),
    };
    //Validation
    try {
      await pastHealthSchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await postPatientRecord(
        "/past_health",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "PAST HEALTH"
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(
        `Error unable to save medical history event: ${err.message}`,
        { containerId: "B" }
      );
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr
      className="pasthealth__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <input
          name="PastHealthProblemDescriptionOrProcedures"
          type="text"
          value={formDatas.PastHealthProblemDescriptionOrProcedures}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="OnsetOrEventDate"
          type="date"
          max={toLocalDate(Date.now())}
          value={toLocalDate(formDatas.OnsetOrEventDate)}
          onChange={handleChange}
        />
      </td>
      <td>
        <GenericList
          list={lifeStageCT}
          value={formDatas.LifeStage}
          name="LifeStage"
          handleChange={handleChange}
          placeHolder="Choose a lifestage..."
          noneOption={false}
        />
      </td>
      <td>
        <input
          name="ProcedureDate"
          type="date"
          max={toLocalDate(Date.now())}
          value={toLocalDate(formDatas.ProcedureDate)}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          name="ResolvedDate"
          type="date"
          max={toLocalDate(Date.now())}
          value={toLocalDate(formDatas.ResolvedDate)}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          name="ProblemStatus"
          type="text"
          value={formDatas.ProblemStatus}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="Notes"
          type="text"
          value={formDatas.Notes}
          onChange={handleChange}
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
        <div className="pasthealth__form-btn-container">
          <input type="submit" value="Save" onClick={handleSubmit} />
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PastHealthForm;
