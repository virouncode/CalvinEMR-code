import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import { lifeStageCT } from "../../../../../datas/codesTables";
import useAuthContext from "../../../../../hooks/useAuthContext";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { famHistorySchema } from "../../../../../validation/famHistoryValidation";
import GenericList from "../../../../All/UI/Lists/GenericList";
import RelativesList from "../../../../All/UI/Lists/RelativesList";

const FamHistoryForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
}) => {
  //HOOKS
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    StartDate: null,
    AgeAtOnset: "",
    LifeStage: "A",
    ProblemDiagnosisProcedureDescription: "",
    Treatment: "",
    Relationship: "",
    Notes: "",
  });

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "StartDate") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPost = {
      ...formDatas,
      ProblemDiagnosisProcedureDescription: firstLetterOfFirstWordUpper(
        formDatas.ProblemDiagnosisProcedureDescription
      ),
      Treatment: firstLetterOfFirstWordUpper(formDatas.Treatment),
      Notes: firstLetterOfFirstWordUpper(formDatas.Notes),
    };

    //Validation
    try {
      await famHistorySchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await postPatientRecord(
        "/family_history",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "FAMILY HISTORY"
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error unable to save family history item: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleMemberChange = (value) => {
    setFormDatas({ ...formDatas, Relationship: value });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr
      className="famhistory__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="famhistory__form-btn-container">
          <input type="submit" value="Save" onClick={handleSubmit} />
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </td>
      <td>
        <input
          name="ProblemDiagnosisProcedureDescription"
          type="text"
          value={formDatas.ProblemDiagnosisProcedureDescription}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <RelativesList
          name="Relationship"
          handleChange={handleMemberChange}
          value={formDatas.Relationship}
        />
      </td>
      <td>
        <input
          type="date"
          max={toLocalDate(Date.now())}
          name="StartDate"
          value={toLocalDate(formDatas.StartDate)}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          type="text"
          name="AgeAtOnset"
          value={formDatas.AgeAtOnset}
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
          type="text"
          name="Treatment"
          value={formDatas.Treatment}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          type="text"
          name="Notes"
          value={formDatas.Notes}
          onChange={handleChange}
        />
      </td>
      <td>
        <em>{staffIdToTitleAndName(staffInfos, user.id, true)}</em>
      </td>
      <td>
        <em>{toLocalDate(Date.now())}</em>
      </td>
    </tr>
  );
};

export default FamHistoryForm;
