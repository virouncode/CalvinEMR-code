import React from "react";
import {
  timestampToDateISOTZ,
  timestampToDateTimeStrTZ,
} from "../../../../../utils/dates/formatDates";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const AppointmentsContent = ({ topicDatas, errMsg, loading }) => {
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas && topicDatas.length > 0 ? (
          <ul>
            {topicDatas.slice(0, 4).map((item) => (
              <li key={item.id}>
                -{" "}
                {!item.all_day
                  ? timestampToDateTimeStrTZ(item.start)
                  : timestampToDateISOTZ(item.start) + " All Day"}{" "}
                ({item.AppointmentPurpose})
              </li>
            ))}
            <li>...</li>
          </ul>
        ) : (
          "No appointments"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default AppointmentsContent;
