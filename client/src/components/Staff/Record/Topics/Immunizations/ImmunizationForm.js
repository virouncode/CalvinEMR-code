import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  immunizationTypeCT,
  routeCT,
  siteCT,
  ynIndicatorsimpleCT,
} from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { immunizationSchema } from "../../../../../validation/record/immunizationValidation";
import GenericCombo from "../../../../UI/Lists/GenericCombo";
import GenericList from "../../../../UI/Lists/GenericList";
import ImmunizationsList from "./ImmunizationsList";

const ImmunizationForm = ({
  patientId,
  setAddVisible,
  setErrMsgPost,
  editCounter,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    ImmunizationType: "",
    ImmunizationName: "",
    Manufacturer: "",
    LotNumber: "",
    Route: "",
    Site: "",
    Dose: "",
    Instructions: "",
    Notes: "",
    recommended: false,
    Date: nowTZTimestamp(),
    RefusedFlag: { ynIndicatorsimple: "N" },
  });
  const [progress, setProgress] = useState(false);

  const handleRouteChange = (value) => {
    setFormDatas({ ...formDatas, Route: value });
  };
  const handleSiteChange = (value) => {
    setFormDatas({ ...formDatas, Site: value });
  };

  const handleSubmit = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    //Formatting
    const datasToPost = {
      ...formDatas,
      ImmunizationName: firstLetterUpper(formDatas.ImmunizationName),
      Manufacturer: firstLetterUpper(formDatas.Manufacturer),
    };
    //Validation
    try {
      await immunizationSchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    try {
      setProgress(true);
      await postPatientRecord(
        "/immunizations",
        user.id,

        datasToPost,
        socket,
        "IMMUNIZATIONS"
      );
      editCounter.current -= 1;
      setAddVisible(false);
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
    const name = e.target.name;
    let value = e.target.value;
    if (name === "RefusedFlag") {
      setFormDatas({ ...formDatas, RefusedFlag: { ynIndicatorsimple: value } });
      return;
    }
    if (name === "Date") {
      value = value ? dateISOToTimestampTZ(value) : null;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr className="immunizations__form">
      <td style={{ textAlign: "center" }}>
        <div className="immunizations__form-btn-container">
          <input
            type="submit"
            value="Save"
            onClick={handleSubmit}
            disabled={progress}
          />
          <button onClick={handleCancel} disabled={progress}>
            Cancel
          </button>
        </div>
      </td>
      <td>
        <ImmunizationsList
          name="ImmunizationType"
          list={immunizationTypeCT}
          value={formDatas.ImmunizationType}
          handleChange={handleChange}
        />
      </td>
      <td>
        <input
          name="ImmunizationName"
          type="text"
          value={formDatas.ImmunizationName}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="Manufacturer"
          type="text"
          value={formDatas.Manufacturer}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="LotNumber"
          type="text"
          value={formDatas.LotNumber}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <GenericCombo
          list={routeCT}
          value={formDatas.Route}
          handleChange={handleRouteChange}
        />
      </td>
      <td>
        <GenericCombo
          list={siteCT}
          value={formDatas.Site}
          handleChange={handleSiteChange}
        />
      </td>
      <td>
        <input
          name="Dose"
          type="text"
          value={formDatas.Dose}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="Date"
          type="date"
          value={timestampToDateISOTZ(formDatas.Date)}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <GenericList
          list={ynIndicatorsimpleCT}
          name="RefusedFlag"
          value={formDatas.RefusedFlag.ynIndicatorsimple}
          handleChange={handleChange}
        />
      </td>
      <td>
        <input
          name="Instructions"
          type="text"
          value={formDatas.Instructions}
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
      <td>{staffIdToTitleAndName(staffInfos, user.id)}</td>
      <td>{timestampToDateISOTZ(nowTZTimestamp())}</td>
    </tr>
  );
};

export default ImmunizationForm;
