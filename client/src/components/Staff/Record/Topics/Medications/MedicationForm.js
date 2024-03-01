import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../../../api/xanoStaff";
import {
  dosageUnitCT,
  formCT,
  frequencyCT,
  routeCT,
  strengthUnitCT,
  ynIndicatorsimpleCT,
} from "../../../../../datas/codesTables";
import useAuthContext from "../../../../../hooks/useAuthContext";
import useFetchTopicDatas from "../../../../../hooks/useFetchTopicDatas";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { toPrescriptionInstructions } from "../../../../../utils/toPrescriptionInstructions";
import { medicationSchema } from "../../../../../validation/medicationValidation";
import { toDurationText } from "../../../../../validation/toDurationText";
import GenericCombo from "../../../../All/UI/Lists/GenericCombo";
import GenericList from "../../../../All/UI/Lists/GenericList";
import DurationPickerLong from "../../../../All/UI/Pickers/DurationPickerLong";
import CircularProgressSmall from "../../../../All/UI/Progress/CircularProgressSmall";
var _ = require("lodash");

const MedicationForm = ({
  patientId,
  addedMeds,
  setAddedMeds,
  progress,
  setFinalInstructions,
  body,
}) => {
  //HOOKS
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [formDatas, setFormDatas] = useState({
    DrugIdentificationNumber: "",
    DrugName: "",
    Strength: { Amount: "", UnitOfMeasure: "" },
    Dosage: "",
    DosageUnitOfMeasure: "",
    Form: "",
    Route: "",
    Frequency: "",
    Duration: "",
    duration: {
      Y: 0,
      M: 0,
      W: 0,
      D: 0,
    },
    RefillDuration: "",
    refill_duration: {
      Y: 0,
      M: 0,
      W: 0,
      D: 0,
    },
    Quantity: "",
    RefillQuantity: "",
    NumberOfRefills: "",
    LongTermMedication: { ynIndicatorsimple: "N" },
    Notes: "",
    PrescriptionInstructions: "",
    SubstitutionNotAllowed: "N",
  });
  const [errMsg, setErrMsg] = useState("");
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 20,
    offset: 0,
  });
  const {
    topicDatas: allergies,
    loading: loadingAllergies,
    errMsg: errAllergies,
  } = useFetchTopicDatas("/allergies_of_patient", paging, patientId);

  //HANDLERS
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToAdd = {
      ...formDatas,
      DrugName: formDatas.DrugName.toUpperCase(),
      temp_id: _.uniqueId(),
    };
    //Validation
    try {
      await medicationSchema.validate(datasToAdd);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    //Submission
    setAddedMeds([...addedMeds, datasToAdd]);
    setFinalInstructions(
      [...addedMeds, datasToAdd]
        .map(({ PrescriptionInstructions }) => PrescriptionInstructions)
        .join("\n\n") +
        "\n\n" +
        body
    );
    setFormDatas({
      DrugIdentificationNumber: "",
      DrugName: "",
      Strength: { Amount: "", UnitOfMeasure: "" },
      Dosage: "",
      DosageUnitOfMeasure: "",
      Form: "",
      Route: "",
      Frequency: "",
      Duration: "",
      duration: {
        Y: 0,
        M: 0,
        W: 0,
        D: 0,
      },
      RefillDuration: "",
      refill_duration: {
        Y: 0,
        M: 0,
        W: 0,
        D: 0,
      },
      Quantity: "",
      RefillQuantity: "",
      NumberOfRefills: "",
      LongTermMedication: { ynIndicatorsimple: "N" },
      Notes: "",
      PrescriptionInstructions: "",
      SubstitutionNotAllowed: "N",
    });
  };

  const handleSubmitAndSaveTemplate = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToAdd = {
      ...formDatas,
      DrugName: formDatas.DrugName.toUpperCase(),
      temp_id: _.uniqueId(),
    };
    //Validation
    try {
      await medicationSchema.validate(datasToAdd);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    //Submission
    setAddedMeds([...addedMeds, datasToAdd]);
    setFormDatas({
      DrugIdentificationNumber: "",
      DrugName: "",
      Strength: { Amount: "", UnitOfMeasure: "" },
      Dosage: "",
      DosageUnitOfMeasure: "",
      Form: "",
      Route: "",
      Frequency: "",
      Duration: "",
      duration: {
        Y: 0,
        M: 0,
        W: 0,
        D: 0,
      },
      RefillDuration: "",
      refill_duration: {
        Y: 0,
        M: 0,
        W: 0,
        D: 0,
      },
      Quantity: "",
      RefillQuantity: "",
      NumberOfRefills: "",
      LongTermMedication: { ynIndicatorsimple: "N" },
      Notes: "",
      PrescriptionInstructions: "",
      SubstitutionNotAllowed: "N",
    });

    //templates
    const templateToPost = {
      ...formDatas,
      staff_id: user.id,
      date_created: Date.now(),
      created_by_id: user.id,
      DrugName: formDatas.DrugName.toUpperCase(),
    };
    //Submission
    try {
      const response = await axiosXanoStaff.post(
        "/medications_templates",
        templateToPost,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      socket.emit("message", {
        route: "MEDS TEMPLATES",
        action: "create",
        content: { data: response.data },
      });
      toast.success("Medication template successfully added", {
        containerId: "B",
      });
    } catch (err) {
      toast.error(`Unable to add medication template: ${err.message}`);
    }
  };
  const handleChange = (e) => {
    setErrMsg("");
    let value = e.target.value;
    const name = e.target.name;
    switch (name) {
      case "Strength":
        setFormDatas({
          ...formDatas,
          Strength: { ...formDatas.Strength, Amount: value },
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName,
            value,
            formDatas.Strength.UnitOfMeasure,
            formDatas.SubstitutionNotAllowed,
            formDatas.Quantity,
            formDatas.Form,
            formDatas.Route,
            formDatas.Dosage,
            formDatas.DosageUnitOfMeasure,
            formDatas.Frequency,
            formDatas.Duration,
            formDatas.NumberOfRefills,
            formDatas.RefillQuantity,
            formDatas.RefillDuration
          ),
        });
        break;
      case "LongTermMedication":
        setFormDatas({
          ...formDatas,
          LongTermMedication: {
            ynIndicatorsimple: value,
          },
        });
        break;
      case "DrugName":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            value,
            formDatas.Strength.Amount,
            formDatas.Strength.UnitOfMeasure,
            formDatas.SubstitutionNotAllowed,
            formDatas.Quantity,
            formDatas.Form,
            formDatas.Route,
            formDatas.Dosage,
            formDatas.DosageUnitOfMeasure,
            formDatas.Frequency,
            formDatas.Duration,
            formDatas.NumberOfRefills,
            formDatas.RefillQuantity,
            formDatas.RefillDuration
          ),
        });
        break;
      case "Dosage":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName,
            formDatas.Strength.Amount,
            formDatas.Strength.UnitOfMeasure,
            formDatas.SubstitutionNotAllowed,
            formDatas.Quantity,
            formDatas.Form,
            formDatas.Route,
            value,
            formDatas.DosageUnitOfMeasure,
            formDatas.Frequency,
            formDatas.Duration,
            formDatas.NumberOfRefills,
            formDatas.RefillQuantity,
            formDatas.RefillDuration
          ),
        });
        break;
      case "SubstitutionNotAllowed":
        setFormDatas({
          ...formDatas,
          [name]: value === "Y" ? "N" : "Y",
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName,
            formDatas.Strength.Amount,
            formDatas.Strength.UnitOfMeasure,
            value === "Y" ? "N" : "Y",
            formDatas.Quantity,
            formDatas.Form,
            formDatas.Route,
            formDatas.Dosage,
            formDatas.DosageUnitOfMeasure,
            formDatas.Frequency,
            formDatas.Duration,
            formDatas.NumberOfRefills,
            formDatas.RefillQuantity,
            formDatas.RefillDuration
          ),
        });
        break;
      case "Quantity":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName,
            formDatas.Strength.Amount,
            formDatas.Strength.UnitOfMeasure,
            formDatas.SubstitutionNotAllowed,
            value,
            formDatas.Form,
            formDatas.Route,
            formDatas.Dosage,
            formDatas.DosageUnitOfMeasure,
            formDatas.Frequency,
            formDatas.Duration,
            formDatas.NumberOfRefills,
            formDatas.RefillQuantity,
            formDatas.RefillDuration
          ),
        });
        break;
      case "RefillQuantity":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName,
            formDatas.Strength.Amount,
            formDatas.Strength.UnitOfMeasure,
            formDatas.SubstitutionNotAllowed,
            formDatas.Quantity,
            formDatas.Form,
            formDatas.Route,
            formDatas.Dosage,
            formDatas.DosageUnitOfMeasure,
            formDatas.Frequency,
            formDatas.Duration,
            formDatas.NumberOfRefills,
            value,
            formDatas.RefillDuration
          ),
        });
        break;
      case "NumberOfRefills":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName,
            formDatas.Strength.Amount,
            formDatas.Strength.UnitOfMeasure,
            formDatas.SubstitutionNotAllowed,
            formDatas.Quantity,
            formDatas.Form,
            formDatas.Route,
            formDatas.Dosage,
            formDatas.DosageUnitOfMeasure,
            formDatas.Frequency,
            formDatas.Duration,
            value,
            formDatas.RefillQuantity,
            formDatas.RefillDuration
          ),
        });
        break;
      default:
        break;
    }
  };
  const handleDurationPickerChange = (e, type) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      duration: {
        ...formDatas.duration,
        [type]: parseInt(value),
      },
      Duration: toDurationText(
        formDatas.duration.Y,
        formDatas.duration.M,
        formDatas.duration.W,
        formDatas.duration.D,
        type,
        parseInt(value)
      ),
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Strength.Amount,
        formDatas.Strength.UnitOfMeasure,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity,
        formDatas.Form,
        formDatas.Route,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        formDatas.Frequency,
        toDurationText(
          formDatas.duration.Y,
          formDatas.duration.M,
          formDatas.duration.W,
          formDatas.duration.D,
          type,
          parseInt(value)
        ),
        formDatas.NumberOfRefills,
        formDatas.RefillQuantity,
        formDatas.RefillDuration
      ),
    });
  };
  const handleRefillDurationPickerChange = (e, type) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      refill_duration: {
        ...formDatas.refill_duration,
        [type]: parseInt(value),
      },
      RefillDuration: toDurationText(
        formDatas.refill_duration.Y,
        formDatas.refill_duration.M,
        formDatas.refill_duration.W,
        formDatas.refill_duration.D,
        type,
        parseInt(value)
      ),
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Strength.Amount,
        formDatas.Strength.UnitOfMeasure,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity,
        formDatas.Form,
        formDatas.Route,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        formDatas.Frequency,
        formDatas.Duration,
        formDatas.NumberOfRefills,
        formDatas.RefillQuantity,
        toDurationText(
          formDatas.refill_duration.Y,
          formDatas.refill_duration.M,
          formDatas.refill_duration.W,
          formDatas.refill_duration.D,
          type,
          parseInt(value)
        )
      ),
    });
  };
  const handleRouteChange = (value) => {
    setFormDatas({
      ...formDatas,
      Route: routeCT.find(({ name }) => name === value)?.code || value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Strength.Amount,
        formDatas.Strength.UnitOfMeasure,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity,
        formDatas.Form,
        value,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        formDatas.Frequency,
        formDatas.Duration,
        formDatas.NumberOfRefills,
        formDatas.RefillQuantity,
        formDatas.RefillDuration
      ),
    });
  };
  const handleFrequencyChange = (value) => {
    setFormDatas({
      ...formDatas,
      Frequency: frequencyCT.find(({ name }) => name === value)?.code || value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Strength.Amount,
        formDatas.Strength.UnitOfMeasure,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity,
        formDatas.Form,
        formDatas.Route,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        value,
        formDatas.Duration,
        formDatas.NumberOfRefills,
        formDatas.RefillQuantity,
        formDatas.RefillDuration
      ),
    });
  };
  const handleDosageUnitChange = (value) => {
    setFormDatas({
      ...formDatas,
      DosageUnitOfMeasure:
        dosageUnitCT.find(({ name }) => name === value)?.code || value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Strength.Amount,
        formDatas.Strength.UnitOfMeasure,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity,
        formDatas.Form,
        formDatas.Route,
        formDatas.Dosage,
        value,
        formDatas.Frequency,
        formDatas.Duration,
        formDatas.NumberOfRefills,
        formDatas.RefillQuantity,
        formDatas.RefillDuration
      ),
    });
  };
  const handleStrengthUnitChange = (value) => {
    setFormDatas({
      ...formDatas,
      Strength: {
        ...formDatas.Strength,
        UnitOfMeasure:
          strengthUnitCT.find(({ name }) => name === value)?.code || value,
      },
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Strength.Amount,
        value,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity,
        formDatas.Form,
        formDatas.Route,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        formDatas.Frequency,
        formDatas.Duration,
        formDatas.NumberOfRefills,
        formDatas.RefillQuantity,
        formDatas.RefillDuration
      ),
    });
  };
  const handleFormChange = (value) => {
    setFormDatas({
      ...formDatas,
      Form: formCT.find(({ name }) => name === value)?.code || value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Strength.Amount,
        formDatas.Strength.UnitOfMeasure,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity,
        value,
        formDatas.Route,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        formDatas.Frequency,
        formDatas.Duration,
        formDatas.NumberOfRefills,
        formDatas.RefillQuantity,
        formDatas.RefillDuration
      ),
    });
  };

  return (
    <form className="medications-form" onSubmit={handleSubmit}>
      <div className="medications-form__title">
        <p>Medications</p>
      </div>
      <div className="medications-form__btn-container">
        <input type="submit" value="Add to RX" disabled={progress} />
        <button onClick={handleSubmitAndSaveTemplate}>
          Add to RX & templates
        </button>
      </div>

      {errMsg && <p className="medications-form__err">{errMsg}</p>}
      <div className="medications-form__allergies">
        <i
          className="fa-solid fa-triangle-exclamation"
          style={{ color: "#ff0000" }}
        ></i>{" "}
        Patient Allergies :{" "}
        {loadingAllergies ? (
          <CircularProgressSmall />
        ) : errAllergies ? (
          errAllergies
        ) : allergies && allergies.length > 0 ? (
          allergies
            .map((allergy) => allergy.OffendingAgentDescription)
            .join(", ")
        ) : (
          "No allergies"
        )}
      </div>
      <div className="med-templates__form-row">
        <label>Drug identification number</label>
        <input
          name="DrugIdentificationNumber"
          type="text"
          value={formDatas.DrugIdentificationNumber}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="med-templates__form-row">
        <label>Drug name*</label>
        <input
          name="DrugName"
          type="text"
          value={formDatas.DrugName}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="med-templates__form-row">
        <label>Strength*</label>
        <input
          name="Strength"
          type="text"
          value={formDatas.Strength.Amount}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="med-templates__form-row">
        <label>Strength unit of measure*</label>
        <GenericCombo
          list={strengthUnitCT}
          value={formDatas.Strength.UnitOfMeasure}
          handleChange={handleStrengthUnitChange}
          placeHolder=""
        />
      </div>
      <div className="med-templates__form-row">
        <label>Form*</label>
        <GenericCombo
          list={formCT}
          value={formDatas.Form}
          handleChange={handleFormChange}
          placeHolder=""
        />
      </div>
      <div className="med-templates__form-row">
        <label>Dosage*</label>
        <input
          name="Dosage"
          type="text"
          value={formDatas.Dosage}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="med-templates__form-row">
        <label>Dosage unit of measure*</label>
        <GenericCombo
          list={dosageUnitCT}
          value={formDatas.DosageUnitOfMeasure}
          handleChange={handleDosageUnitChange}
          placeHolder=""
        />
      </div>
      <div className="med-templates__form-row">
        <label>Route*</label>
        <GenericCombo
          list={routeCT}
          value={formDatas.Route}
          handleChange={handleRouteChange}
          placeHolder=""
        />
      </div>
      <div className="med-templates__form-row">
        <label>Frequency*</label>
        <GenericCombo
          list={frequencyCT}
          value={formDatas.Frequency}
          handleChange={handleFrequencyChange}
        />
      </div>
      <div className="med-templates__form-row">
        <label>Duration*</label>
        <DurationPickerLong
          title={false}
          durationYears={formDatas.duration.Y}
          durationMonths={formDatas.duration.M}
          durationWeeks={formDatas.duration.W}
          durationDays={formDatas.duration.D}
          handleDurationPickerChange={handleDurationPickerChange}
        />
      </div>
      <div className="med-templates__form-row">
        <label>Quantity</label>
        <input
          name="Quantity"
          type="text"
          value={formDatas.Quantity}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="med-templates__form-row">
        <label>Refill duration</label>
        <DurationPickerLong
          title={false}
          durationYears={formDatas.refill_duration.Y}
          durationMonths={formDatas.refill_duration.M}
          durationWeeks={formDatas.refill_duration.W}
          durationDays={formDatas.refill_duration.D}
          handleDurationPickerChange={handleRefillDurationPickerChange}
        />
      </div>
      <div className="med-templates__form-row">
        <label>Refill quantity</label>
        <input
          name="RefillQuantity"
          type="text"
          value={formDatas.RefillQuantity}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="med-templates__form-row">
        <label>Number of refills</label>
        <input
          name="NumberOfRefills"
          type="text"
          value={formDatas.NumberOfRefills}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="med-templates__form-row">
        <label>Long-term medication*</label>
        <GenericList
          name="LongTermMedication"
          list={ynIndicatorsimpleCT}
          value={formDatas.LongTermMedication.ynIndicatorsimple}
          handleChange={handleChange}
          placeHolder="Choose..."
        />
      </div>
      <div className="med-templates__form-row">
        <label>Substitution allowed*</label>
        <GenericList
          name="SubstitutionNotAllowed"
          list={ynIndicatorsimpleCT}
          value={formDatas.SubstitutionNotAllowed === "Y" ? "N" : "Y"}
          handleChange={handleChange}
          placeHolder="Choose..."
        />
      </div>
      <div className="med-templates__form-row med-templates__form-row--text">
        <label>Notes</label>
        <textarea
          className="med-templates__form-notes"
          value={formDatas.Notes}
          onChange={handleChange}
          name="Notes"
        />
      </div>
      <div className="med-templates__form-row med-templates__form-row--text">
        <Tooltip
          title="This is auto-generated, however you can edit the instructions in free text, but it is your responsibility to ensure that they do not contradict the rest of the form."
          placement="top-start"
          arrow
        >
          <label>Instructions*</label>
        </Tooltip>
        <textarea
          className="med-templates__form-instructions"
          value={formDatas.PrescriptionInstructions}
          onChange={handleChange}
          name="PrescriptionInstructions"
        />
      </div>
    </form>
  );
};

export default MedicationForm;
