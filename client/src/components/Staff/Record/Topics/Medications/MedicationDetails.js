import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  getPatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import {
  dosageUnitCT,
  formCT,
  frequencyCT,
  prescriptionStatusCT,
  routeCT,
  toCodeTableName,
  treatmentTypesCT,
  ynIndicatorsimpleCT,
} from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import {
  firstLetterOfFirstWordUpper,
  firstLetterUpper,
} from "../../../../../utils/firstLetterUpper";
import { toPrescriptionInstructions } from "../../../../../utils/toPrescriptionInstructions";
import { medicationSchema } from "../../../../../validation/medicationValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericCombo from "../../../../All/UI/Lists/GenericCombo";
import GenericList from "../../../../All/UI/Lists/GenericList";

const MedicationDetails = ({
  setItemInfos,
  itemInfos,
  setDetailVisible,
  editCounter,
  patientId,
  item,
}) => {
  //HOOKS
  const [editVisible, setEditVisible] = useState(false);
  const { auth, user, socket } = useAuth();
  const [allergies, setAllergies] = useState([]);
  const [errMsg, setErrMsg] = useState("");
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
  const handleEditClick = () => {
    setEditVisible(true);
  };
  const handleCloseClick = () => {
    setDetailVisible(false);
  };
  const handleDeleteClick = async (e) => {
    setErrMsg("");
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        await deletePatientRecord(
          "/medications",
          itemInfos.id,
          auth.authToken,
          socket,
          "MEDICATIONS AND TREATMENTS"
        );
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error unable to delete medication: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };
  const handleChange = (e) => {
    setErrMsg("");
    let value = e.target.value;
    const name = e.target.name;

    switch (name) {
      // case "PrescriptionWrittenDate":
      //   setItemInfos({
      //     ...itemInfos,
      //     PrescriptionWrittenDate:
      //       value === "" ? null : Date.parse(new Date(value)),
      //   });
      //   break;
      // case "StartDate":
      //   setItemInfos({
      //     ...itemInfos,
      //     StartDate: value === "" ? null : Date.parse(new Date(value)),
      //   });
      //   break;
      // case "StrengthAmount":
      //   setItemInfos({
      //     ...itemInfos,
      //     Strength: { ...itemInfos.Strength, Amount: value },
      //   });
      //   break;
      case "FirstName":
        setItemInfos({
          ...itemInfos,
          PrescribedBy: {
            ...itemInfos.PrescribedBy,
            Name: { ...itemInfos.PrescribedBy?.Name, FirstName: value },
          },
        });
        break;
      case "LastName":
        setItemInfos({
          ...itemInfos,
          PrescribedBy: {
            ...itemInfos.PrescribedBy,
            Name: { ...itemInfos.PrescribedBy?.Name, LastName: value },
          },
        });
        break;
      case "OHIPPhysicianId":
        setItemInfos({
          ...itemInfos,
          PrescribedBy: {
            ...itemInfos.PrescribedBy,
            OHIPPhysicianId: value,
          },
        });
        break;
      case "LongTermMedication":
        setItemInfos({
          ...itemInfos,
          LongTermMedication: {
            ...itemInfos.LongTermMedication,
            ynIndicatorsimple: value,
          },
        });
        break;
      case "PastMedication":
        setItemInfos({
          ...itemInfos,
          PastMedication: {
            ...itemInfos.PastMedication,
            ynIndicatorsimple: value,
          },
        });
        break;
      // case "PatientCompliance":
      //   setItemInfos({
      //     ...itemInfos,
      //     PatientCompliance: {
      //       ...itemInfos.PatientCompliance,
      //       ynIndicatorsimple: value,
      //     },
      //   });
      //   break;
      default:
        if (name === "DrugName") {
          setItemInfos({
            ...itemInfos,
            [name]: value,
            PrescriptionInstructions: toPrescriptionInstructions(
              value,
              itemInfos.Form,
              itemInfos.Route,
              itemInfos.Dosage,
              itemInfos.DosageUnitOfMeasure,
              itemInfos.Frequency,
              itemInfos.Duration,
              itemInfos.SubstitutionNotAllowed,
              itemInfos.Quantity
            ),
          });
        } else if (name === "Dosage") {
          setItemInfos({
            ...itemInfos,
            [name]: value,
            PrescriptionInstructions: toPrescriptionInstructions(
              itemInfos.DrugName,
              itemInfos.Form,
              itemInfos.Route,
              value,
              itemInfos.DosageUnitOfMeasure,
              itemInfos.Frequency,
              itemInfos.Duration,
              itemInfos.SubstitutionNotAllowed,
              itemInfos.Quantity
            ),
          });
        } else if (name === "SubstitutionNotAllowed") {
          setItemInfos({
            ...itemInfos,
            [name]: value,
            PrescriptionInstructions: toPrescriptionInstructions(
              itemInfos.DrugName,
              itemInfos.Form,
              itemInfos.Route,
              itemInfos.Dosage,
              itemInfos.DosageUnitOfMeasure,
              itemInfos.Frequency,
              itemInfos.Duration,
              value,
              itemInfos.Quantity
            ),
          });
        } else if (name === "Quantity") {
          setItemInfos({
            ...itemInfos,
            [name]: value,
            PrescriptionInstructions: toPrescriptionInstructions(
              itemInfos.DrugName,
              itemInfos.Form,
              itemInfos.Route,
              itemInfos.Dosage,
              itemInfos.DosageUnitOfMeasure,
              itemInfos.Frequency,
              itemInfos.Duration,
              itemInfos.SubstitutionNotAllowed,
              value
            ),
          });
        } else if (name === "Duration") {
          setItemInfos({
            ...itemInfos,
            [name]: value,
            PrescriptionInstructions: toPrescriptionInstructions(
              itemInfos.DrugName,
              itemInfos.Form,
              itemInfos.Route,
              itemInfos.Dosage,
              itemInfos.DosageUnitOfMeasure,
              itemInfos.Frequency,
              value,
              itemInfos.SubstitutionNotAllowed,
              itemInfos.Quantity
            ),
          });
        } else {
          setItemInfos({
            ...itemInfos,
            [name]: value,
          });
        }
        break;
    }
  };
  const handleFormChange = (value) => {
    setItemInfos({
      ...itemInfos,
      Form: formCT.find(({ name }) => name === value)?.code || value,
      PrescriptionInstructions: toPrescriptionInstructions(
        itemInfos.DrugName,
        value,
        itemInfos.Route,
        itemInfos.Dosage,
        itemInfos.DosageUnitOfMeasure,
        itemInfos.Frequency,
        itemInfos.Duration,
        itemInfos.SubstitutionNotAllowed,
        itemInfos.Quantity
      ),
    });
  };
  const handleRouteChange = (value) => {
    setItemInfos({
      ...itemInfos,
      Route: routeCT.find(({ name }) => name === value)?.code || value,
      PrescriptionInstructions: toPrescriptionInstructions(
        itemInfos.DrugName,
        itemInfos.Form,
        value,
        itemInfos.Dosage,
        itemInfos.DosageUnitOfMeasure,
        itemInfos.Frequency,
        itemInfos.Duration,
        itemInfos.SubstitutionNotAllowed,
        itemInfos.Quantity
      ),
    });
  };

  const handleFrequencyChange = (value) => {
    setItemInfos({
      ...itemInfos,
      Frequency: frequencyCT.find(({ name }) => name === value)?.code || value,
      PrescriptionInstructions: toPrescriptionInstructions(
        itemInfos.DrugName,
        itemInfos.Form,
        itemInfos.Route,
        itemInfos.Dosage,
        itemInfos.DosageUnitOfMeasure,
        value,
        itemInfos.Duration,
        itemInfos.SubstitutionNotAllowed,
        itemInfos.Quantity
      ),
    });
  };

  const handleDosageUnitChange = (value) => {
    setItemInfos({
      ...itemInfos,
      DosageUnitOfMeasure:
        dosageUnitCT.find(({ name }) => name === value)?.code || value,
      PrescriptionInstructions: toPrescriptionInstructions(
        itemInfos.DrugName,
        itemInfos.Form,
        itemInfos.Route,
        itemInfos.Dosage,
        value,
        itemInfos.Frequency,
        itemInfos.Duration,
        itemInfos.SubstitutionNotAllowed,
        itemInfos.Quantity
      ),
    });
  };
  // const handleStrengthUnitChange = (value) => {
  //   setItemInfos({
  //     ...itemInfos,
  //     Strength: {
  //       ...itemInfos.Strength,
  //       UnitOfMeasure:
  //         strengthUnitCT.find(({ name }) => name === value)?.code || value,
  //     },
  //   });
  // };

  const handleCancel = () => {
    setErrMsg("");
    setEditVisible(false);
    setItemInfos(item);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPut = {
      ...itemInfos,
      DrugName: itemInfos.DrugName?.toUpperCase(),
      // Strength: {
      //   ...itemInfos.Strength,
      //   UnitOfMeasure: itemInfos.Strength.UnitOfMeasure.toLowerCase(),
      // },
      PrescribedBy: {
        Name: {
          FirstName: firstLetterUpper(itemInfos.PrescribedBy?.Name?.FirstName),
          LastName: firstLetterUpper(itemInfos.PrescribedBy?.Name?.LastName),
        },
      },
      // DrugDescription: firstLetterOfFirstWordUpper(itemInfos.DrugDescription),
      Notes: firstLetterOfFirstWordUpper(itemInfos.Notes),
    };
    //Validation
    try {
      await medicationSchema.validate(itemInfos);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    //Submission
    try {
      await putPatientRecord(
        "/medications",
        itemInfos.id,
        user.id,
        auth.authToken,
        datasToPut,
        socket,
        "MEDICATIONS AND TREATMENTS"
      );
      editCounter.current -= 1;
      setDetailVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error unable to update medication: ${err.message}`, {
        containerId: "B",
      });
    }
  };
  return (
    <div
      className="medications-detail__container"
      style={{ border: errMsg && "solid 1.5px red" }}
    >
      <form onSubmit={handleSubmit}>
        <div className="medications-detail__btn-container">
          {editVisible ? (
            <>
              <input type="submit" onClick={handleSubmit} value="Save" />
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={handleEditClick}>
                Edit
              </button>
              <button type="button" onClick={handleDeleteClick}>
                Delete
              </button>
            </>
          )}
          <button type="button" onClick={handleCloseClick}>
            Close
          </button>
        </div>
        {errMsg && <div className="medications__err">{errMsg}</div>}
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
        {/* <div className="medications-detail__row">
          <label>Prescription written date</label>
          {editVisible ? (
            <input
              name="PrescriptionWrittenDate"
              type="date"
              value={toLocalDate(itemInfos.PrescriptionWrittenDate)}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            toLocalDate(itemInfos.PrescriptionWrittenDate)
          )}
        </div>
        <div className="medications-detail__row">
          <label>Start date</label>
          {editVisible ? (
            <input
              name="StartDate"
              type="date"
              value={toLocalDate(itemInfos.StartDate)}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            toLocalDate(itemInfos.StartDate)
          )}
        </div> */}
        <div className="medications-detail__row">
          <label>Drug name*</label>
          {editVisible ? (
            <input
              name="DrugName"
              type="text"
              value={itemInfos.DrugName}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.DrugName
          )}
        </div>
        {/* <div className="medications-detail__row">
          <label>Strength</label>
          <div className="medications-detail__subrow">
            <label>Amount</label>
            {editVisible ? (
              <input
                name="StrengthAmount"
                type="text"
                value={itemInfos.Strength?.Amount}
                onChange={handleChange}
                autoComplete="off"
              />
            ) : (
              <span style={{ marginRight: "10px" }}>
                {itemInfos.Strength?.Amount}
              </span>
            )}
          </div>
          <div className="medications-detail__subrow">
            <label>Unit of measure</label>
            {editVisible ? (
              <GenericCombo
                list={strengthUnitCT}
                value={itemInfos.Strength?.UnitOfMeasure}
                handleChange={handleStrengthUnitChange}
                placeHolder=""
              />
            ) : (
              <span style={{ marginRight: "10px" }}>
                {toCodeTableName(
                  strengthUnitCT,
                  itemInfos.Strength?.UnitOfMeasure
                ) || itemInfos.Strength?.UnitOfMeasure}
              </span>
            )}
          </div>
        </div> */}
        {/* <div className="medications-detail__row">
          <label>Number of refills</label>
          {editVisible ? (
            <input
              name="NumberOfRefills"
              type="text"
              value={itemInfos.NumberOfRefills}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.NumberOfRefills
          )}
        </div> */}
        <div className="medications-detail__row">
          <label>Dosage*</label>
          {editVisible ? (
            <input
              name="Dosage"
              type="text"
              value={itemInfos.Dosage}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.Dosage
          )}
        </div>
        <div className="medications-detail__row">
          <label>Dosage unit of measure*</label>
          {editVisible ? (
            <GenericCombo
              list={dosageUnitCT}
              value={itemInfos.DosageUnitOfMeasure}
              handleChange={handleDosageUnitChange}
              placeHolder=""
            />
          ) : (
            toCodeTableName(dosageUnitCT, itemInfos.DosageUnitOfMeasure) ||
            itemInfos.DosageUnitOfMeasure
          )}
        </div>
        <div className="medications-detail__row">
          <label>Form*</label>
          {editVisible ? (
            <GenericCombo
              list={formCT}
              value={itemInfos.Form}
              handleChange={handleFormChange}
              placeHolder=""
            />
          ) : (
            toCodeTableName(formCT, itemInfos.Form) || itemInfos.Form
          )}
        </div>
        <div className="medications-detail__row">
          <label>Route*</label>
          {editVisible ? (
            <GenericCombo
              list={routeCT}
              value={itemInfos.Route}
              handleChange={handleRouteChange}
              placeHolder=""
            />
          ) : (
            toCodeTableName(routeCT, itemInfos.Route) || itemInfos.Route
          )}
        </div>
        <div className="medications-detail__row">
          <label>Frequency*</label>
          {editVisible ? (
            <GenericCombo
              list={frequencyCT}
              value={itemInfos.Frequency}
              handleChange={handleFrequencyChange}
            />
          ) : (
            toCodeTableName(frequencyCT, itemInfos.Frequency)
          )}
        </div>
        <div className="medications-detail__row">
          <label>Duration</label>
          {editVisible ? (
            <input
              name="Duration"
              type="text"
              value={itemInfos.Duration}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.Duration
          )}
        </div>
        {/* <div className="medications-detail__row">
          <label>Refill duration (days)</label>
          {editVisible ? (
            <input
              name="RefillDuration"
              type="text"
              value={itemInfos.RefillDuration}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.RefillDuration
          )}
        </div> */}
        <div className="medications-detail__row">
          <label>Quantity</label>
          {editVisible ? (
            <input
              name="Quantity"
              type="text"
              value={itemInfos.Quantity}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.Quantity
          )}
        </div>
        {/* <div className="medications-detail__row">
          <label>Refill Quantity</label>
          {editVisible ? (
            <input
              name="RefillQuantity"
              type="text"
              value={itemInfos.RefillQuantity}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.RefillQuantity
          )}
        </div> */}
        <div className="medications-detail__row">
          <label>Long term medication</label>
          {editVisible ? (
            <GenericList
              name="LongTermMedication"
              list={ynIndicatorsimpleCT}
              value={itemInfos.LongTermMedication?.ynIndicatorsimple}
              handleChange={handleChange}
              placeHolder="Choose..."
            />
          ) : (
            toCodeTableName(
              ynIndicatorsimpleCT,
              itemInfos.LongTermMedication?.ynIndicatorsimple
            )
          )}
        </div>
        <div className="medications-detail__row">
          <label>Past medication</label>
          {editVisible ? (
            <GenericList
              name="PastMedication"
              list={ynIndicatorsimpleCT}
              value={itemInfos.PastMedication?.ynIndicatorsimple}
              handleChange={handleChange}
              placeHolder="Choose..."
            />
          ) : (
            toCodeTableName(
              ynIndicatorsimpleCT,
              itemInfos.PastMedication?.ynIndicatorsimple
            )
          )}
        </div>
        <div className="medications-detail__row">
          <label>Prescribed by</label>
          <div className="medications-detail__subrow">
            <label>First name</label>
            {editVisible ? (
              <input
                name="FirstName"
                type="text"
                value={itemInfos.PrescribedBy?.Name?.FirstName}
                onChange={handleChange}
                autoComplete="off"
              />
            ) : (
              <span style={{ marginRight: "10px" }}>
                {itemInfos.PrescribedBy?.Name?.FirstName}
              </span>
            )}
            <label>Last name</label>
            {editVisible ? (
              <input
                name="LastName"
                type="text"
                value={itemInfos.PrescribedBy?.Name?.LastName}
                onChange={handleChange}
                autoComplete="off"
              />
            ) : (
              <span style={{ marginRight: "10px" }}>
                {itemInfos.PrescribedBy?.Name?.LastName}
              </span>
            )}
            <label>OHIP#</label>
            {editVisible ? (
              <input
                name="OHIPPhysicianId"
                type="text"
                value={itemInfos.PrescribedBy?.OHIPPhysicianId}
                onChange={handleChange}
                autoComplete="off"
              />
            ) : (
              itemInfos.PrescribedBy?.OHIPPhysicianId
            )}
          </div>
        </div>

        {/* <div className="medications-detail__row">
          <label>Patient compliance</label>
          {editVisible ? (
            <GenericList
              name="PatientCompliance"
              list={ynIndicatorsimpleCT}
              value={itemInfos.PatientCompliance?.ynIndicatorsimple}
              handleChange={handleChange}
              placeHolder="Choose..."
            />
          ) : (
            toCodeTableName(
              ynIndicatorsimpleCT,
              itemInfos.PatientCompliance?.ynIndicatorsimple
            )
          )}
        </div> */}
        <div className="medications-detail__row">
          <label>Treatment type</label>
          {editVisible ? (
            <GenericList
              name="TreatmentType"
              list={treatmentTypesCT}
              value={itemInfos.TreatmentType}
              handleChange={handleChange}
              placeHolder="Choose..."
            />
          ) : (
            toCodeTableName(treatmentTypesCT, itemInfos.TreatmentType)
          )}
        </div>
        <div className="medications-detail__row">
          <label>Prescription status</label>
          {editVisible ? (
            <GenericList
              name="PrescriptionStatus"
              list={prescriptionStatusCT}
              value={itemInfos.PrescriptionStatus}
              handleChange={handleChange}
              placeHolder="Choose..."
            />
          ) : (
            toCodeTableName(prescriptionStatusCT, itemInfos.PrescriptionStatus)
          )}
        </div>
        {/* <div className="medications-detail__row">
          <label>Non authoritative indicator</label>
          {editVisible ? (
            <GenericList
              name="NonAuthoritativeIndicator"
              list={ynIndicatorsimpleCT}
              value={itemInfos.NonAuthoritativeIndicator}
              handleChange={handleChange}
              placeHolder="Choose..."
            />
          ) : (
            toCodeTableName(
              ynIndicatorsimpleCT,
              itemInfos.NonAuthoritativeIndicator
            )
          )}
        </div>
        <div className="medications-detail__row">
          <label>Prescription identifier</label>
          {editVisible ? (
            <input
              name="PrescriptionIdentifier"
              type="text"
              value={itemInfos.PrescriptionIdentifier}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.PrescriptionIdentifier
          )}
        </div>
        <div className="medications-detail__row">
          <label>Prior prescription identifier</label>
          {editVisible ? (
            <input
              name="PriorPrescriptionReferenceIdentifier"
              type="text"
              value={itemInfos.PriorPrescriptionReferenceIdentifier}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.PriorPrescriptionReferenceIdentifier
          )}
        </div>
        <div className="medications-detail__row">
          <label>Dispense interval (days)</label>
          {editVisible ? (
            <input
              name="DispenseInterval"
              type="text"
              value={itemInfos.DispenseInterval}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.DispenseInterval
          )}
        </div>
        <div className="medications-detail__row">
          <label>Drug description</label>
          {editVisible ? (
            <input
              name="DrugDescription"
              type="text"
              value={itemInfos.DrugDescription}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.DrugDescription
          )}
        </div> */}
        <div className="medications-detail__row">
          <label>Substitution not allowed</label>
          {editVisible ? (
            <GenericList
              name="SubstitutionNotAllowed"
              list={ynIndicatorsimpleCT}
              value={itemInfos.SubstitutionNotAllowed}
              handleChange={handleChange}
              placeHolder="Choose..."
            />
          ) : (
            toCodeTableName(
              ynIndicatorsimpleCT,
              itemInfos.SubstitutionNotAllowed
            )
          )}
        </div>
        <div className="medications-detail__row medications-detail__row--textarea">
          <label>Prescription Instructions</label>
          {editVisible ? (
            <textarea
              name="PrescriptionInstructions"
              value={itemInfos.PrescriptionInstructions}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.PrescriptionInstructions
          )}
        </div>
        <div className="medications-detail__row medications-detail__row--textarea">
          <label>Notes</label>
          {editVisible ? (
            <textarea
              name="Notes"
              value={itemInfos.Notes}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.Notes
          )}
        </div>
      </form>
    </div>
  );
};

export default MedicationDetails;
