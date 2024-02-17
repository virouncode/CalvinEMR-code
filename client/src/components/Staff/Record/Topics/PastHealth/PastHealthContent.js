import React from "react";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const PastHealthContent = ({ topicDatas, loading, errMsg }) => {
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas && topicDatas.length > 0 ? (
          <ul>
            {topicDatas.slice(0, 4).map((item) => (
              <li key={item.id}>
                - {item.PastHealthProblemDescriptionOrProcedures}
              </li>
            ))}
            <li>...</li>
          </ul>
        ) : (
          "No past health"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default PastHealthContent;
