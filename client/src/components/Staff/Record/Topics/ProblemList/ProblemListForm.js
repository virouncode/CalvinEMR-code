import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import { lifeStageCT } from "../../../../../datas/codesTables";
import useAuthContext from "../../../../../hooks/useAuthContext";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { problemListSchema } from "../../../../../validation/problemListValidation";
import GenericList from "../../../../All/UI/Lists/GenericList";

const ProblemListForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
}) => {
  //HOOKS
  const { auth, user, clinic, socket } = useAuthContext();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
  });

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "OnsetDate" || name === "ResolutionDate") {
      value = value ? Date.parse(new Date()) : null;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPost = {
      ...formDatas,
      ProblemDiagnosisDescription: firstLetterOfFirstWordUpper(
        formDatas.ProblemDiagnosisDescription
      ),
      ProblemDescription: firstLetterOfFirstWordUpper(
        formDatas.ProblemDescription
      ),
      ProblemStatus: firstLetterOfFirstWordUpper(formDatas.ProblemStatus),
      Notes: firstLetterOfFirstWordUpper(formDatas.Notes),
    };
    //Validation
    try {
      await problemListSchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await postPatientRecord(
        "/problemlist",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "PROBLEM LIST"
      );

      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to save problem list: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  return (
    <tr
      className="problemlist__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <input
          name="ProblemDiagnosisDescription"
          type="text"
          value={formDatas.ProblemDiagnosisDescription}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="ProblemDescription"
          type="text"
          value={formDatas.ProblemDescription}
          onChange={handleChange}
          autoComplete="off"
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
          name="OnsetDate"
          type="date"
          value={toLocalDate(formDatas.OnsetDate)}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <GenericList
          list={lifeStageCT}
          value={formDatas.LifeStage}
          name="LifeStage"
          handleChange={handleChange}
        />
      </td>
      <td>
        <input
          name="ResolutionDate"
          type="date"
          value={toLocalDate(formDatas.ResolutionDate)}
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
        <div className="problemlist__form-btn-container">
          <input type="submit" value="Save" onClick={handleSubmit} />
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProblemListForm;
