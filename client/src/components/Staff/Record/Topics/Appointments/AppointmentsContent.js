import React from "react";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const AppointmentsContent = ({ datas, errMsg, isLoading }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.start - a.start)
              .map((appointment) => (
                <li key={appointment.id}>
                  -{" "}
                  {!appointment.all_day
                    ? new Date(appointment.start).toLocaleString("en-CA", {
                        //local time
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })
                    : new Date(appointment.start).toLocaleString("en-CA", {
                        //local time
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      }) + " All Day"}{" "}
                  ({appointment.AppointmentPurpose})
                </li>
              ))}
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
