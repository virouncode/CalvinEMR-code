import React from "react";
import {
  formCT,
  frequencyCT,
  routeCT,
  toCodeTableName,
  ynIndicatorsimpleCT,
} from "../../../../../omdDatas/codesTables";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";

const MedicationDetails = ({ item }) => {
  return (
    <div className="medications-detail__container">
      <div>
        <div className="medications-detail__row">
          <label>Prescription written date</label>
          <p>{timestampToDateISOTZ(item.PrescriptionWrittenDate)}</p>
        </div>
        <div className="medications-detail__row">
          <label>Start date</label>
          <p>{timestampToDateISOTZ(item.StartDate)}</p>
        </div>
        <div className="medications-detail__row">
          <label>Drug identification number (DIN)</label>
          <p>{item.DrugIdentificationNumber || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Drug name</label>
          <p>{item.DrugName || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Drug description</label>
          <p>{item.DrugDescription || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Strength</label>
          <p>
            {item.Strength?.Amount || ""} {item.Strength?.UnitOfMeasure || ""}
          </p>
        </div>
        <div className="medications-detail__row">
          <label>Dosage</label>
          <p>
            {item.Dosage || ""} {item.DosageUnitOfMeasure || ""}
          </p>
        </div>
        <div className="medications-detail__row">
          <label>Form</label>
          <p>{toCodeTableName(formCT, item.Form) || item.Form || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Route</label>
          <p>{toCodeTableName(routeCT, item.Route) || item.Route || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Frequency</label>
          <p>
            {toCodeTableName(frequencyCT, item.Frequency) ||
              item.Frequency ||
              ""}
          </p>
        </div>
        <div className="medications-detail__row">
          <label>Duration</label>
          <p>{item.Duration || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Quantity</label>
          <p>{item.Quantity || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Refill duration</label>
          <p>{item.RefillDuration || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Refill Quantity</label>
          <p>{item.RefillQuantity || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Number of refills</label>
          <p>{item.NumberOfRefills || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Long-term medication</label>
          <p>
            {item.LongTermMedication?.ynIndicatorsimple
              ? toCodeTableName(
                  ynIndicatorsimpleCT,
                  item.LongTermMedication?.ynIndicatorsimple
                )
              : ""}
          </p>
        </div>
        <div className="medications-detail__row">
          <label>Past medication</label>
          <p>
            {item.PastMedication?.ynIndicatorsimple
              ? toCodeTableName(
                  ynIndicatorsimpleCT,
                  item.PastMedication?.ynIndicatorsimple
                )
              : ""}
          </p>
        </div>
        <div className="medications-detail__row">
          <label>Prescribed by</label>
          <p>
            {item.PrescribedBy?.Name?.FirstName || ""}{" "}
            {item.PrescribedBy?.Name?.LastName || ""}{" "}
            {item.PrescribedBy?.Name?.OHIPPhysicianId || ""}
          </p>
        </div>
        <div className="medications-detail__row">
          <label>Notes</label>
          <p style={{ whiteSpace: "pre" }}>{item.Notes || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Instructions</label>
          <p style={{ whiteSpace: "pre" }}>
            {item.PrescriptionInstructions || ""}
          </p>
        </div>
        <div className="medications-detail__row">
          <label>Prescription id</label>
          <p>{item.PrescriptionIdentifier || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Prior prescription id</label>
          <p>{item.PriorPrescriptionReferenceIdentifier || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Dispense interval</label>
          <p>{item.DispenseInterval || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Substitution allowed</label>
          <p>
            {item.SubstitutionNotAllowed
              ? item.SubstitutionNotAllowed === "Y"
                ? "No"
                : "Yes"
              : ""}
          </p>
        </div>
        <div className="medications-detail__row">
          <label>Problem code</label>
          <p>{item.ProblemCode || ""}</p>
        </div>
        <div className="medications-detail__row">
          <label>Protocol id</label>
          <p>{item.ProtocolIdentifier || ""}</p>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetails;
