import React from "react";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const ProblemListContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.date_created - a.date_created)
              .map((problem) => (
                <li key={problem.id}>
                  - {problem.ProblemDiagnosisDescription}
                  {", "}
                  {problem.ProblemDescription}
                </li>
              ))}
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
