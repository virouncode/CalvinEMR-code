import { CircularProgress } from "@mui/material";
import React from "react";

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
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default AppointmentsContent;
