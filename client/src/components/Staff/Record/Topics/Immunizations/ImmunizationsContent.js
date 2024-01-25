import { CircularProgress } from "@mui/material";
import React from "react";

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
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default ImmunizationsContent;
