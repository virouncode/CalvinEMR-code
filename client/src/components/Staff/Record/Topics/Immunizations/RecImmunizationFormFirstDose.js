import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import { routeCT, siteCT } from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import { firstLetterUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { immunizationSchema } from "../../../../../validation/immunizationValidation";
import GenericCombo from "../../../../All/UI/Lists/GenericCombo";

const RecImmunizationFormFirstDose = ({
  setFormVisible,
  type,
  age,
  rangeStart,
  rangeEnd,
  route,
  patientId,
  errMsgPost,
  setErrMsgPost,
}) => {
  //HOOKS
  const { auth, user, socket } = useAuth();
  const [formDatas, setFormDatas] = useState({
    ImmunizationName: "",
    ImmunizationType: type,
    Manufacturer: "",
    LotNumber: "",
    Route: route,
    Site: "",
    Dose: "",
    Date: rangeEnd,
    Instructions: "",
    Notes: "",
    age: age,
    doseNumber: 1,
    patient_id: patientId,
    recommended: true,
  });

  //HANDLERS
  const handleCancel = () => {
    setFormVisible(false);
  };
  const handleSubmit = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    //Formatting
    const datasToPost = {
      ...formDatas,
      ImmunizationName: firstLetterUpper(formDatas.ImmunizationName),
      Manufacturer: firstLetterUpper(formDatas.Manufacturer),
      patient_id: patientId,
    };
    //Validation
    try {
      await immunizationSchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await postPatientRecord(
        "/immunizations",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "IMMUNIZATIONS"
      );
      setFormVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error unable to save immunization: ${err.message}`, {
        containerId: "B",
      });
    }
  };
  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    if (name === "Date") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    setFormDatas({
      ...formDatas,
      [name]: value,
    });
  };

  const handleRouteChange = (value) => {
    setFormDatas({
      ...formDatas,
      Route: value,
    });
  };
  const handleSiteChange = (value) => {
    setFormDatas({
      ...formDatas,
      Site: value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="recimmunizations-form">
      {errMsgPost && <p className="immunizations__err">{errMsgPost}</p>}
      <div className="recimmunizations-form__row">
        <label>Immunization type: </label>
        <p>{type}</p>
      </div>
      <div className="recimmunizations-form__row">
        <label>Immunization brand name: </label>
        <input
          type="text"
          name="ImmunizationName"
          onChange={handleChange}
          value={formDatas.ImmunizationName}
          autoComplete="off"
        />
      </div>
      <div className="recimmunizations-form__row">
        <label>Manufacturer: </label>
        <input
          type="text"
          name="Manufacturer"
          onChange={handleChange}
          value={formDatas.Manufacturer}
          autoComplete="off"
        />
      </div>
      <div className="recimmunizations-form__row">
        <label>Lot#: </label>
        <input
          type="text"
          name="LotNumber"
          onChange={handleChange}
          value={formDatas.LotNumber}
          autoComplete="off"
        />
      </div>
      <div className="recimmunizations-form__row">
        <label>Route: </label>
        <GenericCombo
          list={routeCT}
          value={formDatas.Route}
          handleChange={handleRouteChange}
        />
      </div>
      <div className="recimmunizations-form__row">
        <label>Site: </label>
        <GenericCombo
          list={siteCT}
          value={formDatas.Site}
          handleChange={handleSiteChange}
        />
      </div>
      <div className="recimmunizations-form__row">
        <label>Dose: </label>
        <input
          type="text"
          name="Dose"
          onChange={handleChange}
          value={formDatas.Dose}
          autoComplete="off"
        />
      </div>
      <div className="recimmunizations-form__row">
        <label>Date: </label>
        <input
          type="date"
          name="Date"
          onChange={handleChange}
          value={toLocalDate(formDatas.Date)}
          autoComplete="off"
        />
      </div>
      <div className="recimmunizations-form__row recimmunizations-form__row--text">
        <label>Instructions: </label>
        <textarea
          name="Instructions"
          onChange={handleChange}
          value={formDatas.Instructions}
          autoComplete="off"
        />
      </div>
      <div className="recimmunizations-form__row recimmunizations-form__row--text">
        <label>Notes: </label>
        <textarea
          name="Notes"
          onChange={handleChange}
          value={formDatas.Notes}
          autoComplete="off"
        />
      </div>
      <div className="recimmunizations-form__btns">
        <input type="submit" value="Save" />
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RecImmunizationFormFirstDose;
