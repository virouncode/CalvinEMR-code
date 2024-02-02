import { CircularProgress } from "@mui/material";
import React from "react";
import { isMedicationActive } from "../../../../../utils/isMedicationActive";

const MedicationsContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .filter((med) => isMedicationActive(med.StartDate, med.duration))
              .sort((a, b) => b.StartDate - a.StartDate)
              .map((medication) => (
                <li key={medication.id}>
                  -{" "}
                  <strong>
                    {medication.DrugName} {medication.Strength.Amount}{" "}
                    {medication.Strength.UnitOfMeasure}
                  </strong>
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
