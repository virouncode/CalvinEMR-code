import React from "react";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import EmptyParagraph from "../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../All/UI/Tables/LoadingParagraph";

const PastAppointments = ({ pastAppointments, loading, err }) => {
  const { staffInfos } = useStaffInfosContext();

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
        {err && (
          <p className="appointments-patient__err">
            Unable to fetch next appointments
          </p>
        )}
        {!err && pastAppointments && pastAppointments.length > 0
          ? pastAppointments.map((appointment) => (
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
                <p>{staffIdToTitleAndName(staffInfos, appointment.host_id)}</p>
              </div>
            ))
          : !loading && <EmptyParagraph text="No past appointments" />}
        {loading && <LoadingParagraph />}
      </div>
    </div>
  );
};

export default PastAppointments;
