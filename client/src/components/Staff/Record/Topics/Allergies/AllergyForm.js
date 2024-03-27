import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  lifeStageCT,
  propertyOfOffendingAgentCT,
  reactionSeverityCT,
  reactionTypeCT,
} from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToAMPMStrTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { allergySchema } from "../../../../../validation/record/allergyValidation";
import GenericList from "../../../../UI/Lists/GenericList";

const AllergyForm = ({
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
    OffendingAgentDescription: "",
    PropertyOfOffendingAgent: "",
    ReactionType: "",
    StartDate: "",
    LifeStage: "",
    Severity: "",
    Reaction: "",
    RecordedDate: nowTZTimestamp(),
    Notes: "",
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "StartDate" || name === "RecordedDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
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
      setProgress(true);
      await postPatientRecord(
        "/allergies",
        user.id,

        datasToPost,
        socket,
        "ALLERGIES & ADVERSE REACTIONS"
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error: unable to save new allergy: ${err.message}`, {
        containerId: "B",
      });
      setProgress(false);
    }
  };

  return (
    <tr
      className="allergies__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="allergies__form-btn-container">
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
          value={timestampToAMPMStrTZ(formDatas.StartDate, "America/Toronto")}
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
      <td>{timestampToDateISOTZ(formDatas.RecordedDate, "America/Toronto")}</td>
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
        <em>{staffIdToTitleAndName(staffInfos, user.id)}</em>
      </td>
      <td>
        <em>{timestampToDateISOTZ(nowTZTimestamp(), "America/Toronto")}</em>
      </td>
    </tr>
  );
};

export default AllergyForm;
