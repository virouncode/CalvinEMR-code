import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import {
  routeCT,
  siteCT,
  ynIndicatorsimpleCT,
} from "../../../../../datas/codesTables";
import useAuthContext from "../../../../../hooks/useAuthContext";
import { firstLetterUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { immunizationSchema } from "../../../../../validation/immunizationValidation";
import GenericCombo from "../../../../All/UI/Lists/GenericCombo";
import GenericList from "../../../../All/UI/Lists/GenericList";

const RecImmunizationFormSecondDose = ({
  setFormVisible,
  type,
  age,
  errMsgPost,
  setErrMsgPost,
  rangeStart,
  rangeEnd,
  route,
  patientId,
  immunizationInfos,
}) => {
  //HOOKS
  const { auth, user, socket } = useAuthContext();
  const [formDatas, setFormDatas] = useState({
    ImmunizationName: "",
    ImmunizationType: type,
    Manufacturer: "",
    LotNumber: "",
    Route: route,
    Site: "",
    Dose: "",
    Date: toLocalDate(
      new Date(
        new Date(
          immunizationInfos.find(({ doseNumber }) => doseNumber === 1)?.Date
        ).setMonth(
          new Date(
            immunizationInfos.find(({ doseNumber }) => doseNumber === 1)?.Date
          ).getMonth() + 6
        )
      )
    ),
    RefusedFlag: { ynIndicatorsimple: "N" },
    Instructions: "",
    Notes: "",
    age: age,
    doseNumber: 2,
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
    if (name === "RefusedFlag") {
      setFormDatas({
        ...formDatas,
        RefusedFlag: { ynIndicatorsimple: value },
      });
      return;
    }
    if (name === "Date") {
      value === "" ? (value = null) : (value = Date.parse(new Date(value)));
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
      <div className="recimmunizations-form__row">
        <label>Refused: </label>
        <GenericList
          list={ynIndicatorsimpleCT}
          name="RefusedFlag"
          handleChange={handleChange}
          value={formDatas.RefusedFlag.ynIndicatorsimple}
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

export default RecImmunizationFormSecondDose;
