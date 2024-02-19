import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import {
  immunizationTypeCT,
  routeCT,
  siteCT,
  ynIndicatorsimpleCT,
} from "../../../../../datas/codesTables";
import useAuthContext from "../../../../../hooks/useAuthContext";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { firstLetterUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { immunizationSchema } from "../../../../../validation/immunizationValidation";
import GenericCombo from "../../../../All/UI/Lists/GenericCombo";
import GenericList from "../../../../All/UI/Lists/GenericList";
import ImmunizationsList from "../../../../All/UI/Lists/ImmunizationsList";

const ImmunizationForm = ({
  patientId,
  setAddVisible,
  setErrMsgPost,
  editCounter,
}) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    recommended: false,
    Date: Date.now(),
    RefusedFlag: { ynIndicatorsimple: "N" },
  });

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
      await postPatientRecord(
        "/immunizations",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "IMMUNIZATIONS"
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error unable to save immunization: ${err.message}`, {
        containerId: "B",
      });
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
      value = value ? Date.parse(new Date(value)) : null;
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
          value={toLocalDate(formDatas.Date)}
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
      <td>{staffIdToTitleAndName(staffInfos, user.id, true)}</td>
      <td>{toLocalDate(Date.now())}</td>
      <td style={{ textAlign: "center" }}>
        <div className="immunizations__form-btn-container">
          <input type="submit" value="Save" onClick={handleSubmit} />
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </td>
    </tr>
  );
};

export default ImmunizationForm;
