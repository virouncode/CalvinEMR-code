import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getPatientRecord,
  postPatientRecord,
} from "../../../../../api/fetchRecords";
import {
  dosageUnitCT,
  formCT,
  frequencyCT,
  prescriptionStatusCT,
  routeCT,
  treatmentTypesCT,
  ynIndicatorsimpleCT,
} from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import {
  firstLetterOfFirstWordUpper,
  firstLetterUpper,
} from "../../../../../utils/firstLetterUpper";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../../utils/staffIdToName";
import { toPrescriptionInstructions } from "../../../../../utils/toPrescriptionInstructions";
import { medicationSchema } from "../../../../../validation/medicationValidation";
import GenericCombo from "../../../../All/UI/Lists/GenericCombo";
import GenericList from "../../../../All/UI/Lists/GenericList";
import MedicationsLinks from "./MedicationsLinks";

const MedicationForm = ({
  patientId,
  setAddVisible,
  editCounter,
  setErrMsgPost,
  errMsgPost,
}) => {
  //HOOKS
  const { auth, user, socket, clinic } = useAuth();
  const [allergies, setAllergies] = useState([]);
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    PrescribedBy: {
      Name: {
        FirstName: staffIdToFirstName(clinic.staffInfos, user.id),
        LastName: staffIdToLastName(clinic.staffInfos, user.id),
      },
      OHIPPhysicianId: staffIdToOHIP(clinic.staffInfos, user.id),
    },
    PrescriptionStatus: "Active",
  });
  const [errAllergies, setErrAllergies] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAllergies = async () => {
      try {
        const allergiesResults = await getPatientRecord(
          "/allergies_for_patient",
          patientId,
          auth.authToken,
          abortController
        );
        if (abortController.signal.aborted) return;
        setAllergies(allergiesResults);
      } catch (err) {
        setErrAllergies(
          `Error: unable to fetch patient allergies: ${err.message}`
        );
      }
    };
    fetchAllergies();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken, patientId]);

  //HANDLERS
  const handleCancel = (e) => {
    e.preventDefault();
    setAddVisible(false);
  };
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;

    switch (name) {
      // case "PrescriptionWrittenDate":
      //   setFormDatas({
      //     ...formDatas,
      //     PrescriptionWrittenDate:
      //       value === "" ? null : Date.parse(new Date(value)),
      //   });
      //   break;
      // case "StartDate":
      //   setFormDatas({
      //     ...formDatas,
      //     StartDate: value === "" ? null : Date.parse(new Date(value)),
      //   });
      //   break;
      // case "StrengthAmount":
      //   setFormDatas({
      //     ...formDatas,
      //     Strength: { ...formDatas.Strength, Amount: value },
      //   });
      //   break;
      case "FirstName":
        setFormDatas({
          ...formDatas,
          PrescribedBy: {
            ...formDatas.PrescribedBy,
            Name: { ...formDatas.PrescribedBy?.Name, FirstName: value },
          },
        });
        break;
      case "LastName":
        setFormDatas({
          ...formDatas,
          PrescribedBy: {
            ...formDatas.PrescribedBy,
            Name: { ...formDatas.PrescribedBy?.Name, LastName: value },
          },
        });
        break;
      case "OHIPPhysicianId":
        setFormDatas({
          ...formDatas,
          PrescribedBy: {
            ...formDatas.PrescribedBy,
            OHIPPhysicianId: value,
          },
        });
        break;
      case "LongTermMedication":
        setFormDatas({
          ...formDatas,
          LongTermMedication: {
            ...formDatas.LongTermMedication,
            ynIndicatorsimple: value,
          },
        });
        break;
      case "PastMedication":
        setFormDatas({
          ...formDatas,
          PastMedication: {
            ...formDatas.PastMedication,
            ynIndicatorsimple: value,
          },
        });
        break;
      // case "PatientCompliance":
      //   setFormDatas({
      //     ...formDatas,
      //     PatientCompliance: {
      //       ...formDatas.PatientCompliance,
      //       ynIndicatorsimple: value,
      //     },
      //   });
      //   break;
      default:
        if (name === "DrugName") {
          setFormDatas({
            ...formDatas,
            [name]: value,
            PrescriptionInstructions: toPrescriptionInstructions(
              value,
              formDatas.Form,
              formDatas.Route,
              formDatas.Dosage,
              formDatas.DosageUnitOfMeasure,
              formDatas.Frequency,
              formDatas.Duration,
              formDatas.SubstitutionNotAllowed,
              formDatas.Quantity
            ),
          });
        } else if (name === "Dosage") {
          setFormDatas({
            ...formDatas,
            [name]: value,
            PrescriptionInstructions: toPrescriptionInstructions(
              formDatas.DrugName,
              formDatas.Form,
              formDatas.Route,
              value,
              formDatas.DosageUnitOfMeasure,
              formDatas.Frequency,
              formDatas.Duration,
              formDatas.SubstitutionNotAllowed,
              formDatas.Quantity
            ),
          });
        } else if (name === "SubstitutionNotAllowed") {
          setFormDatas({
            ...formDatas,
            [name]: value,
            PrescriptionInstructions: toPrescriptionInstructions(
              formDatas.DrugName,
              formDatas.Form,
              formDatas.Route,
              formDatas.Dosage,
              formDatas.DosageUnitOfMeasure,
              formDatas.Frequency,
              formDatas.Duration,
              value,
              formDatas.Quantity
            ),
          });
        } else if (name === "Quantity") {
          setFormDatas({
            ...formDatas,
            [name]: value,
            PrescriptionInstructions: toPrescriptionInstructions(
              formDatas.DrugName,
              formDatas.Form,
              formDatas.Route,
              formDatas.Dosage,
              formDatas.DosageUnitOfMeasure,
              formDatas.Frequency,
              formDatas.Duration,
              formDatas.SubstitutionNotAllowed,
              value
            ),
          });
        } else if (name === "Duration") {
          setFormDatas({
            ...formDatas,
            [name]: value,
            PrescriptionInstructions: toPrescriptionInstructions(
              formDatas.DrugName,
              formDatas.Form,
              formDatas.Route,
              formDatas.Dosage,
              formDatas.DosageUnitOfMeasure,
              formDatas.Frequency,
              value,
              formDatas.SubstitutionNotAllowed,
              formDatas.Quantity
            ),
          });
        } else {
          setFormDatas({
            ...formDatas,
            [name]: value,
          });
        }
        break;
    }
  };
  const handleFormChange = (value) => {
    setFormDatas({
      ...formDatas,
      Form: formCT.find(({ name }) => name === value)?.code || value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        value,
        formDatas.Route,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        formDatas.Frequency,
        formDatas.Duration,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity
      ),
    });
  };
  const handleRouteChange = (value) => {
    setFormDatas({
      ...formDatas,
      Route: routeCT.find(({ name }) => name === value)?.code || value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Form,
        value,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        formDatas.Frequency,
        formDatas.Duration,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity
      ),
    });
  };

  const handleFrequencyChange = (value) => {
    setFormDatas({
      ...formDatas,
      Frequency: frequencyCT.find(({ name }) => name === value)?.code || value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Form,
        formDatas.Route,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        value,
        formDatas.Duration,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity
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
        formDatas.Form,
        formDatas.Route,
        formDatas.Dosage,
        value,
        formDatas.Frequency,
        formDatas.Duration,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity
      ),
    });
  };
  // const handleStrengthUnitChange = (value) => {
  //   setFormDatas({
  //     ...formDatas,
  //     Strength: {
  //       ...formDatas.Strength,
  //       UnitOfMeasure:
  //         strengthUnitCT.find(({ name }) => name === value)?.code || value,
  //     },
  //   });
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsgPost("");
    //Formatting
    const datasToPost = {
      ...formDatas,
      DrugName: formDatas.DrugName?.toUpperCase(),
      // Strength: {
      //   ...formDatas.Strength,
      //   UnitOfMeasure: formDatas.Strength?.UnitOfMeasure?.toLowerCase(),
      // },
      PrescribedBy: {
        Name: {
          FirstName: firstLetterUpper(formDatas.PrescribedBy?.Name?.FirstName),
          LastName: firstLetterUpper(formDatas.PrescribedBy?.Name?.LastName),
        },
      },
      // DrugDescription: firstLetterOfFirstWordUpper(formDatas.DrugDescription),
      Notes: firstLetterOfFirstWordUpper(formDatas.Notes),
    };
    //Validation
    try {
      await medicationSchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await postPatientRecord(
        "/medications",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "MEDICATIONS AND TREATMENTS"
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to save medication : ${err.message}`, {
        containerId: "B",
      });
    }
  };

  return (
    <div
      className="medications-form__container"
      style={{ border: errMsgPost && "solid 1px red" }}
    >
      <form onSubmit={handleSubmit}>
        <div className="medications-form__btn-container">
          <input type="submit" value="Save" />
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
        <div className="medications-form__allergies">
          <i
            className="fa-solid fa-triangle-exclamation"
            style={{ color: "#ff0000" }}
          ></i>{" "}
          Patient Allergies :{" "}
          {errAllergies
            ? errAllergies
            : allergies && allergies.length > 0
            ? allergies
                .map((allergy) => allergy.OffendingAgentDescription)
                .join(", ")
            : "No Allergies"}
        </div>
        {/* <div className="medications-form__row">
          <label>Prescription written date</label>
          <input
            name="PrescriptionWrittenDate"
            type="date"
            value={toLocalDate(formDatas.PrescriptionWrittenDate)}
            onChange={handleChange}
            autoComplete="off"
          />
        </div> */}
        {/* <div className="medications-form__row">
          <label>Start date</label>
          <input
            name="StartDate"
            type="date"
            value={toLocalDate(formDatas.StartDate)}
            onChange={handleChange}
            autoComplete="off"
          />
        </div> */}
        <div className="medications-form__row">
          <label>Drug name*</label>
          <input
            name="DrugName"
            type="text"
            value={formDatas.DrugName}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        {/* <div className="medications-form__row">
          <label>Strength</label>
          <div className="medications-form__subrow">
            <label>Amount</label>
            <input
              name="StrengthAmount"
              type="text"
              value={formDatas.Strength?.Amount}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="medications-form__subrow">
            <label>Unit of measure</label>
            <GenericCombo
              list={strengthUnitCT}
              value={formDatas.Strength?.UnitOfMeasure}
              handleChange={handleStrengthUnitChange}
              placeHolder=""
            />
          </div>
        </div> */}
        <div className="medications-form__row">
          <label>Dosage*</label>
          <input
            name="Dosage"
            type="text"
            value={formDatas.Dosage}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="medications-form__row">
          <label>Dosage unit of measure*</label>
          <GenericCombo
            list={dosageUnitCT}
            value={formDatas.DosageUnitOfMeasure}
            handleChange={handleDosageUnitChange}
            placeHolder=""
          />
        </div>
        <div className="medications-form__row">
          <label>Form*</label>
          <GenericCombo
            list={formCT}
            value={formDatas.Form}
            handleChange={handleFormChange}
            placeHolder=""
          />
        </div>
        <div className="medications-form__row">
          <label>Route*</label>
          <GenericCombo
            list={routeCT}
            value={formDatas.Route}
            handleChange={handleRouteChange}
            placeHolder=""
          />
        </div>
        <div className="medications-form__row">
          <label>Frequency*</label>
          <GenericCombo
            list={frequencyCT}
            value={formDatas.Frequency}
            handleChange={handleFrequencyChange}
          />
        </div>
        <div className="medications-form__row">
          <label>Duration*</label>
          <input
            name="Duration"
            type="text"
            value={formDatas.Duration}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="medications-form__row">
          <label>Quantity</label>
          <input
            name="Quantity"
            type="text"
            value={formDatas.Quantity}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        {/* <div className="medications-form__row">
          <label>Number of refills</label>
          <input
            name="NumberOfRefills"
            type="text"
            value={formDatas.NumberOfRefills}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="medications-form__row">
          <label>Refill duration</label>
          <input
            name="RefillDuration"
            type="text"
            value={formDatas.RefillDuration}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="medications-form__row">
          <label>Refill Quantity</label>
          <input
            name="RefillQuantity"
            type="text"
            value={formDatas.RefillQuantity}
            onChange={handleChange}
            autoComplete="off"
          />
        </div> */}
        <div className="medications-form__row">
          <label>Long term medication</label>
          <GenericList
            name="LongTermMedication"
            list={ynIndicatorsimpleCT}
            value={formDatas.LongTermMedication?.ynIndicatorsimple}
            handleChange={handleChange}
            placeHolder="Choose..."
          />
        </div>
        <div className="medications-form__row">
          <label>Past medication</label>
          <GenericList
            name="PastMedication"
            list={ynIndicatorsimpleCT}
            value={formDatas.PastMedication?.ynIndicatorsimple}
            handleChange={handleChange}
            placeHolder="Choose..."
          />
        </div>
        <div className="medications-form__row">
          <label>Prescribed by</label>
          <div className="medications-form__subrow">
            <label>First name</label>
            <input
              name="FirstName"
              type="text"
              value={formDatas.PrescribedBy?.Name?.FirstName}
              onChange={handleChange}
              autoComplete="off"
            />
            <label>Last name</label>
            <input
              name="LastName"
              type="text"
              value={formDatas.PrescribedBy?.Name?.LastName}
              onChange={handleChange}
              autoComplete="off"
            />
            <label>OHIP#</label>
            <input
              name="OHIPPhysicianId"
              type="text"
              value={formDatas.PrescribedBy?.OHIPPhysicianId}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>
        {/* <div className="medications-form__row">
          <label>Patient compliance</label>
          <GenericList
            name="PatientCompliance"
            list={ynIndicatorsimpleCT}
            value={formDatas.PatientCompliance?.ynIndicatorsimple}
            handleChange={handleChange}
            placeHolder="Choose..."
          />
        </div> */}
        <div className="medications-form__row">
          <label>Treatment type</label>
          <GenericList
            name="TreatmentType"
            list={treatmentTypesCT}
            value={formDatas.TreatmentType}
            handleChange={handleChange}
            placeHolder="Choose..."
          />
        </div>
        <div className="medications-form__row">
          <label>Prescription status</label>
          <GenericList
            name="PrescriptionStatus"
            list={prescriptionStatusCT}
            value={formDatas.PrescriptionStatus}
            handleChange={handleChange}
            placeHolder="Choose..."
          />
        </div>
        {/* <div className="medications-form__row">
          <label>Non authoritative indicator</label>
          <GenericList
            name="NonAuthoritativeIndicator"
            list={ynIndicatorsimpleCT}
            value={formDatas.NonAuthoritativeIndicator}
            handleChange={handleChange}
            placeHolder="Choose..."
          />
        </div>
        <div className="medications-form__row">
          <label>Prescription identifier</label>
          <input
            name="PrescriptionIdentifier"
            type="text"
            value={formDatas.PrescriptionIdentifier}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="medications-form__row">
          <label>Prior prescription identifier</label>
          <input
            name="PriorPrescriptionReferenceIdentifier"
            type="text"
            value={formDatas.PriorPrescriptionReferenceIdentifier}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="medications-form__row">
          <label>Dispense interval (days)</label>
          <input
            name="DispenseInterval"
            type="text"
            value={formDatas.DispenseInterval}
            onChange={handleChange}
            autoComplete="off"
          />
        </div> */}
        {/* <div className="medications-form__row">
          <label>Drug description</label>
          <input
            name="DrugDescription"
            type="text"
            value={formDatas.DrugDescription}
            onChange={handleChange}
            autoComplete="off"
          />
        </div> */}
        <div className="medications-form__row">
          <label>Substitution not allowed</label>
          <GenericList
            name="SubstitutionNotAllowed"
            list={ynIndicatorsimpleCT}
            value={formDatas.SubstitutionNotAllowed}
            handleChange={handleChange}
            placeHolder="Choose..."
          />
        </div>
        <div className="medications-form__row medications-form__row--textarea">
          <label>Prescription Instructions*</label>
          <textarea
            name="PrescriptionInstructions"
            value={formDatas.PrescriptionInstructions}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="medications-form__row medications-form__row--textarea">
          <label>Notes</label>
          <textarea
            name="Notes"
            value={formDatas.Notes}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </form>
      <MedicationsLinks />
      {/* <MedsSearch handleMedClick={handleMedClick} /> */}
    </div>
  );
};

export default MedicationForm;
