import React from "react";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const ImmunizationsContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        Please open the pop-up to see patient's immunizations details
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default ImmunizationsContent;
