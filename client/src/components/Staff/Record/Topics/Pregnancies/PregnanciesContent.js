import React from "react";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const PregnanciesContent = ({ topicDatas, loading, errMsg }) => {
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas && topicDatas.length >= 1 ? (
          <ul>
            {topicDatas.map((item) => (
              <li key={item.id}>
                - {item.description} ({timestampToDateISOTZ(item.date_of_event)}
                )
              </li>
            ))}
            <li>...</li>
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
