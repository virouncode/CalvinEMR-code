import { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import useAuthContext from "../../../../../hooks/useAuthContext";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { personalHistorySchema } from "../../../../../validation/personalHistoryValidation";

const PersonalHistoryForm = ({ setPopUpVisible, patientId }) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [formDatas, setFormDatas] = useState({
    occupations: "",
    income: "",
    religion: "",
    sexual_orientation: "",
    special_diet: "",
    smoking: "",
    alcohol: "",
    recreational_drugs: "",
  });
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
    //Validation
    if (!Object.values(formDatas).some((v) => v) || !formDatas) {
      setErrMsgPost("Please fill at least one field");
      return;
    }
    try {
      await personalHistorySchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Formatting
    const datasToPost = {
      patient_id: patientId,
      ResidualInfo: {
        DataElement: [
          formDatas.occupations && {
            Name: "Occupations",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.occupations),
          },
          formDatas.income && {
            Name: "Income",
            DataType: "text",
            Content: formDatas.income,
          },
          formDatas.religion && {
            Name: "Religion",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.religion),
          },
          formDatas.sexual_orientation && {
            Name: "SexualOrientation",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.sexual_orientation),
          },
          formDatas.special_diet && {
            Name: "SpecialDiet",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.special_diet),
          },
          formDatas.smoking && {
            Name: "Smoking",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.smoking),
          },
          formDatas.alcohol && {
            Name: "Alcohol",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.alcohol),
          },
          formDatas.recreational_drugs && {
            Name: "RecreationalDrugs",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.recreational_drugs),
          },
        ].filter((element) => element),
      },
    };
    //Submission
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
      // setPopUpVisible(false);
    } catch (err) {
      toast.error(`Error unable to save social history: ${err.message}`, {
        containerId: "B",
      });
      return;
    }
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
          value={formDatas.occupations}
          name="occupations"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p>
        <label>Income: </label>
        <input
          type="text"
          value={formDatas.income}
          name="income"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p>
        {" "}
        <label>Religion: </label>
        <input
          type="text"
          value={formDatas.religion}
          name="religion"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p>
        <label>Sexual orientation: </label>
        <input
          type="text"
          value={formDatas.sexual_orientation}
          name="sexual_orientation"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p>
        <label>Special diet: </label>
        <input
          type="text"
          value={formDatas.special_diet}
          name="special_diet"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p>
        <label>Smoking: </label>
        <input
          type="text"
          value={formDatas.smoking}
          name="smoking"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p>
        <label>Alcohol: </label>
        <input
          type="text"
          value={formDatas.alcohol}
          name="alcohol"
          onChange={handleChange}
          autoComplete="off"
        />
      </p>
      <p>
        <label>Recreational drugs: </label>
        <input
          type="text"
          value={formDatas.recreational_drugs}
          name="recreational_drugs"
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
