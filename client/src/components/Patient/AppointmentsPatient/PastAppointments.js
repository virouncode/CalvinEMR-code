import React from "react";
import useAuthContext from "../../../hooks/useAuthContext";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";

const PastAppointments = ({ pastAppointments }) => {
  const { clinic } = useAuthContext();

  const optionsDate = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const optionsTime = {
    hour: "2-digit",
    minute: "2-digit",
  };

  return (
    <div className="appointments-patient appointments-patient--past">
      <div className="appointments-patient__title">Past Appointments</div>
      <div className="appointments-patient__content">
        {pastAppointments ? (
          pastAppointments.length ? (
            pastAppointments.map((appointment) => (
              <div key={appointment.id} className="appointments-patient__item">
                {!appointment.all_day ? (
                  <div className="appointments-patient__date">
                    <p>
                      {new Date(appointment.start).toLocaleString(
                        "en-CA",
                        optionsDate
                      )}
                    </p>
                    <p>
                      {new Date(appointment.start).toLocaleTimeString(
                        "en-CA",
                        optionsTime
                      )}{" "}
                      -{" "}
                      {new Date(appointment.end).toLocaleTimeString(
                        "en-CA",
                        optionsTime
                      )}
                    </p>
                  </div>
                ) : (
                  <div>
                    {new Date(appointment.start).toLocaleString(
                      "en-CA",
                      optionsDate
                    )}{" "}
                    {`All Day`}
                  </div>
                )}
                <p>Reason : {appointment.AppointmentPurpose}</p>
                <p>
                  {staffIdToTitleAndName(
                    clinic.staffInfos,
                    appointment.host_id,
                    true
                  )}
                </p>
              </div>
            ))
          ) : (
            <div>No past appointments</div>
          )
        ) : (
          <CircularProgressMedium />
        )}
      </div>
    </div>
  );
};

export default PastAppointments;
