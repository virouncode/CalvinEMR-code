import React from "react";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const AllergiesContent = ({ topicDatas, loading, errMsg }) => {
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas && topicDatas.length >= 1 ? (
          <ul>
            {topicDatas.map((item) => (
              <li key={item.id}>- {item.OffendingAgentDescription}</li>
            ))}
            <li>...</li>
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
