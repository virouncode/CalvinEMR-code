import React from "react";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

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
                  ? new Date(item.start).toLocaleString("en-CA", {
                      //local time
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : new Date(item.start).toLocaleString("en-CA", {
                      //local time
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    }) + " All Day"}{" "}
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
