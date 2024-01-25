import { CircularProgress } from "@mui/material";
import React from "react";

const RiskContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.StartDate - a.StartDate)
              .map((risk) => (
                <li key={risk.id}>- {risk.RiskFactor}</li>
              ))}
          </ul>
        ) : (
          "No risk factors"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default RiskContent;
