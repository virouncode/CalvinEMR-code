import { CircularProgress } from "@mui/material";
import React from "react";
import { toLocalDate } from "../../../../../utils/formatDates";

const PregnanciesContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.date_of_event - a.date_of_event)
              .map((pregnancy) => (
                <li key={pregnancy.id}>
                  - {pregnancy.description} (
                  {toLocalDate(pregnancy.date_of_event)})
                </li>
              ))}
          </ul>
        ) : (
          "No pregnancies"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default PregnanciesContent;
