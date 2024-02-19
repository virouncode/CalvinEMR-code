import { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import useAuthContext from "../../../../../hooks/useAuthContext";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { personalHistorySchema } from "../../../../../validation/personalHistoryValidation";

const PersonalHistoryForm = ({ setPopUpVisible, patientId }) => {
  const { user, auth, socket } = useAuthContext();
  const [formDatas, setFormDatas] = useState({});
  const [errMsgPost, setErrMsgPost] = useState("");

  const handleChange = (e) => {
    setErrMsgPost("");
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleClose = (e) => {
    e.preventDefault();
    setPopUpVisible(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatasForValidation = { ...formDatas };
    //Validation
    if (
      !Object.values(formDatasForValidation).some((v) => v) ||
      !formDatasForValidation
    ) {
      setErrMsgPost("Please fill at least one field");
      return;
    }
    try {
      await personalHistorySchema.validate(formDatasForValidation);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    const datasToPost = {
      patient_id: patientId,
      ResidualInfo: {
        DataElement: [
          {
            Name: "Occupations",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.Occupations),
          },
          { Name: "Income", DataType: "text", Content: formDatas.Income },
          {
            Name: "Religion",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.Religion),
          },
          {
            Name: "SexualOrientation",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.SexualOrientation),
          },
          {
            Name: "SpecialDiet",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.SpecialDiet),
          },
          {
            Name: "Smoking",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.Smoking),
          },
          {
            Name: "Alcohol",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.Alcohol),
          },
          {
            Name: "RecreationalDrugs",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.RecreationalDrugs),
          },
        ],
      },
    };

    try {
      await postPatientRecord(
        "/personal_history",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "PERSONAL HISTORY"
      );

      toast.success("Saved successfully", { containerId: "A" });
    } catch (err) {
      toast.error(`Error unable to save social history: ${err.message}`, {
        containerId: "B",
      });
    }
    setPopUpVisible(false);
  };
  return (
    <form className="personalhistory-form">
      {errMsgPost && (
        <div className="personalhistory-form__err">{errMsgPost}</div>
      )}
      <p>
        <label>Occupations: </label>
        <input
          type="text"
          value={formDatas.Occupations}
          name="Occupations"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p>
        <label>Income: </label>
        <input
          type="text"
          value={formDatas.Income}
          name="Income"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p>
        {" "}
        <label>Religion: </label>
        <input
          type="text"
          value={formDatas.Religion}
          name="Religion"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p>
        <label>Sexual orientation: </label>
        <input
          type="text"
          value={formDatas.SexualOrientation}
          name="SexualOrientation"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p>
        <label>Special diet: </label>
        <input
          type="text"
          value={formDatas.SpecialDiet}
          name="SpecialDiet"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p>
        <label>Smoking: </label>
        <input
          type="text"
          value={formDatas.Smoking}
          name="Smoking"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p>
        <label>Alcohol: </label>
        <input
          type="text"
          value={formDatas.Alcohol}
          name="Alcohol"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p>
        <label>Recreational drugs: </label>
        <input
          type="text"
          value={formDatas.RecreationalDrugs}
          name="RecreationalDrugs"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p className="personalhistory-card__btns">
        <button onClick={handleSubmit}>Save</button>
        <button onClick={handleClose}>Close</button>
      </p>
    </form>
  );
};

export default PersonalHistoryForm;
