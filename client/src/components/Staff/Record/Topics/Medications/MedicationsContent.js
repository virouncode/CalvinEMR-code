import React from "react";
import { isMedicationActive } from "../../../../../utils/isMedicationActive";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const MedicationsContent = ({ topicDatas, loading, errMsg }) => {
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas && topicDatas.length >= 1 ? (
          <ul>
            {topicDatas
              .filter((med) => isMedicationActive(med.StartDate, med.duration))
              .slice(0, 4)
              .map((medication) => (
                <li key={medication.id}>
                  - {medication.DrugName} {medication.Strength.Amount}{" "}
                  {medication.Strength.UnitOfMeasure}
                </li>
              ))}
            <li>...</li>
          </ul>
        ) : (
          "No medications"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default MedicationsContent;
