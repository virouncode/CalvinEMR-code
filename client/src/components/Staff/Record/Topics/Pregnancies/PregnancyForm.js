import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import useAuth from "../../../../../hooks/useAuth";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { pregnancySchema } from "../../../../../validation/pregnancyValidation";
import PregnanciesList from "../../../../All/UI/Lists/PregnanciesList";

const PregnancyForm = ({
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
    description: "",
    date_of_event: Date.now(),
    premises: "",
    term_nbr_of_weeks: "",
    term_nbr_of_days: "",
  });

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "date_of_event") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    if (name === "term_nbr_of_weeks" || name === "term_nbr_of_days") {
      value = parseInt(value);
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
    //Fomatting
    const datasToPost = { ...formDatas };
    const formDatasForValidation = { ...formDatas };
    if (formDatasForValidation.term_nbr_of_weeks === "") {
      formDatasForValidation.term_nbr_of_weeks = 0;
    }
    if (formDatasForValidation.term_nbr_of_days === "") {
      formDatasForValidation.term_nbr_of_days = 0;
    }
    datasToPost.premises = firstLetterOfFirstWordUpper(formDatas.premises);

    //Vaidation
    try {
      await pregnancySchema.validate(formDatasForValidation);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await postPatientRecord(
        "/pregnancies",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "PREGNANCIES"
      );

      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to save pregnancey event: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  return (
    <tr
      className="pregnancies-form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <PregnanciesList
          value={formDatas.description}
          name="description"
          handleChange={handleChange}
        />
      </td>
      <td>
        <input
          name="date_of_event"
          type="date"
          value={toLocalDate(formDatas.date_of_event)}
          onChange={handleChange}
          className="pregnancies-form__input2"
        />
      </td>
      <td>
        <input
          name="premises"
          type="text"
          value={formDatas.premises}
          onChange={handleChange}
          autoComplete="off"
          className="pregnancies-form__input1"
        />
      </td>
      <td>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <input
            name="term_nbr_of_weeks"
            type="number"
            value={formDatas.term_nbr_of_weeks}
            onChange={handleChange}
            autoComplete="off"
            className="pregnancies-form__input3"
          />
          w
          <input
            name="term_nbr_of_days"
            type="number"
            value={formDatas.term_nbr_of_days}
            onChange={handleChange}
            autoComplete="off"
            className="pregnancies-form__input3"
          />
          d
        </div>
      </td>
      <td>
        <em>{staffIdToTitleAndName(clinic.staffInfos, user.id, true)}</em>{" "}
      </td>
      <td>
        <em>{toLocalDate(Date.now())}</em>
      </td>
      <td>
        <div className="pregnancies-form__btn-container">
          <input type="submit" value="Save" onClick={handleSubmit} />
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PregnancyForm;
