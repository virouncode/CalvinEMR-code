import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import {
  lifeStageCT,
  propertyOfOffendingAgentCT,
  reactionSeverityCT,
  reactionTypeCT,
} from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { allergySchema } from "../../../../../validation/allergyValidation";
import GenericList from "../../../../All/UI/Lists/GenericList";

const AllergyForm = ({
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
    RecordedDate: Date.now(),
  });

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "StartDate" || name === "RecordedDate") {
      value = value === "" ? null : Date.parse(new Date(value));
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
      OffendingAgentDescription: firstLetterOfFirstWordUpper(
        formDatas.OffendingAgentDescription
      ),
      Reaction: firstLetterOfFirstWordUpper(formDatas.Reaction),
      Notes: firstLetterOfFirstWordUpper(formDatas.Notes),
    };
    //Validation
    try {
      await allergySchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await postPatientRecord(
        "/allergies",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "ALLERGIES & ADVERSE REACTIONS"
      );

      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to save new allergy: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  return (
    <tr
      className="allergies__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <input
          name="OffendingAgentDescription"
          type="text"
          value={formDatas.OffendingAgentDescription}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <GenericList
          list={propertyOfOffendingAgentCT}
          value={formDatas.PropertyOfOffendingAgent}
          name="PropertyOfOffendingAgent"
          handleChange={handleChange}
        />
      </td>
      <td>
        <GenericList
          list={reactionTypeCT}
          value={formDatas.ReactionType}
          name="ReactionType"
          handleChange={handleChange}
        />
      </td>
      <td>
        <input
          name="StartDate"
          type="date"
          value={toLocalDate(formDatas.StartDate)}
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
        <GenericList
          list={reactionSeverityCT}
          value={formDatas.Severity}
          name="Severity"
          handleChange={handleChange}
        />
      </td>
      <td>
        <input
          name="Reaction"
          type="text"
          value={formDatas.Reaction}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>{toLocalDate(formDatas.RecordedDate)}</td>
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
        <div className="allergies__form-btn-container">
          <input type="submit" value="Save" onClick={handleSubmit} />
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AllergyForm;
