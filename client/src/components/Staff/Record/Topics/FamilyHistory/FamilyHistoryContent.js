import React from "react";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const FamilyHistoryContent = ({ topicDatas, loading, errMsg }) => {
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas && topicDatas.length > 0 ? (
          <ul>
            {topicDatas.slice(0, 4).map((event) => (
              <li key={event.id}>
                - {event.ProblemDiagnosisProcedureDescription} (
                {event.Relationship})
              </li>
            ))}
            <li>...</li>
          </ul>
        ) : (
          "No family history"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default FamilyHistoryContent;
