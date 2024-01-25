import { CircularProgress } from "@mui/material";
import React from "react";
import {
  dosageUnitCT,
  formCT,
  frequencyCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";

const MedicationsContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .filter(
                ({ PrescriptionStatus }) => PrescriptionStatus === "Active"
              )
              .sort((a, b) => b.date_created - a.date_created)
              .map((medication) => (
                <li key={medication.id}>
                  - <strong>{medication.DrugName}</strong> (
                  {toCodeTableName(formCT, medication.Form) || medication.Form}
                  ), {medication.Dosage}{" "}
                  {toCodeTableName(
                    dosageUnitCT,
                    medication.DosageUnitOfMeasure
                  ) || medication.DosageUnitOfMeasure}
                  ,{" "}
                  {toCodeTableName(frequencyCT, medication.Frequency) ||
                    medication.Frequency}
                  , {"during "}
                  {medication.Duration}
                </li>
              ))}
          </ul>
        ) : (
          "No medications"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default MedicationsContent;
