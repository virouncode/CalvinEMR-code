import React from "react";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const ImmunizationsContent = ({ topicDatas, loading, errMsg }) => {
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">Open immunizations pop-up</div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default ImmunizationsContent;
