import React from "react";
import { toLocalDate } from "../../../../../utils/formatDates";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

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
    <CircularProgressMedium />
  );
};

export default PregnanciesContent;
