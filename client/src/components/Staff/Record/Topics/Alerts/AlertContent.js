import { CircularProgress } from "@mui/material";
import React from "react";

const AlertsContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.DateActive - a.DateActive)
              .map((item) => (
                <li key={item.id}>
                  - {item.AlertDescription}
                  {item.Notes ? `: ${item.Notes}` : null}
                </li>
              ))}
          </ul>
        ) : (
          "No alerts"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default AlertsContent;
