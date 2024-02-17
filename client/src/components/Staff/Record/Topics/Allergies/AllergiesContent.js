import React from "react";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const AllergiesContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.date_created - a.date_created)
              .map((allergy) => (
                <li key={allergy.id}>- {allergy.OffendingAgentDescription}</li>
              ))}
          </ul>
        ) : (
          "No allergies"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default AllergiesContent;
