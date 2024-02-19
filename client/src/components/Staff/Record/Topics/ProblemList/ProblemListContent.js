import React from "react";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const ProblemListContent = ({ topicDatas, loading, errMsg }) => {
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas && topicDatas.length > 0 ? (
          <ul>
            {topicDatas.slice(0, 4).map((item) => (
              <li key={item.id}>
                - {item.ProblemDiagnosisDescription}
                {", "}
                {item.ProblemDescription}
              </li>
            ))}
            <li>...</li>
          </ul>
        ) : (
          "No problems"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default ProblemListContent;
