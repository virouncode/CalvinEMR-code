import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import {
  routeCT,
  siteCT,
  ynIndicatorsimpleCT,
} from "../../../../../datas/codesTables";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { firstLetterUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { immunizationSchema } from "../../../../../validation/immunizationValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericCombo from "../../../../All/UI/Lists/GenericCombo";
import GenericList from "../../../../All/UI/Lists/GenericList";

const RecImmunizationEditMultiple = ({
  immunizationInfos,
  type,
  errMsgPost,
  setErrMsgPost,
  setEditVisible,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [formDatas, setFormDatas] = useState(immunizationInfos);
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleCancel = () => {
    setEditVisible(false);
  };
  const handleDelete = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to remove this immunization ?",
      })
    ) {
      try {
        setProgress(true);
        await deletePatientRecord(
          "/immunizations",
          immunizationInfos.id,

          socket,
          "IMMUNIZATIONS"
        );
        setEditVisible(false);
        toast.success("Deleted successfully", { containerId: "B" });
        setProgress(false);
      } catch (err) {
        toast.error(`Error unable to delete immunization: ${err.message}`, {
          containerId: "B",
        });
        setProgress(false);
      }
    }
  };
  const handleSubmit = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    //Formatting
    const datasToPut = {
      ...formDatas,
      ImmunizationName: firstLetterUpper(formDatas.ImmunizationName),
      Manufacturer: firstLetterUpper(formDatas.Manufacturer),
    };
    //Validation
    try {
      await immunizationSchema.validate(datasToPut);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      setProgress(true);
      await putPatientRecord(
        `/immunizations/${immunizationInfos.id}`,
        user.id,
        datasToPut,
        socket,
        "IMMUNIZATIONS"
      );
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error unable to save immunization: ${err.message}`, {
        containerId: "B",
      });
      setProgress(false);
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
        <input type="submit" value="Save" disabled={progress} />
        <button type="button" onClick={handleDelete} disabled={progress}>
          Delete
        </button>
        <button type="button" onClick={handleCancel} disabled={progress}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RecImmunizationEditMultiple;
