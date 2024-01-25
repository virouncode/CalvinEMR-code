import { CircularProgress } from "@mui/material";
import React from "react";

const PastHealthContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.OnsetOrEventDate - a.OnsetOrEventDate)
              .map((event) => (
                <li key={event.id}>
                  - {event.PastHealthProblemDescriptionOrProcedures}
                </li>
              ))}
          </ul>
        ) : (
          "No past health"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default PastHealthContent;
