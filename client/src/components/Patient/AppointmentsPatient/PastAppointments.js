import React from "react";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import {
  timestampToHumanDateTZ,
  timestampToHumanDateTimeTZ,
} from "../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import EmptyParagraph from "../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../All/UI/Tables/LoadingParagraph";

const PastAppointments = ({ pastAppointments, loading, err }) => {
  const { staffInfos } = useStaffInfosContext();

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
                    <p>{timestampToHumanDateTimeTZ(appointment.start)} - </p>
                    <p>{timestampToHumanDateTimeTZ(appointment.end)}</p>
                  </div>
                ) : (
                  <div>
                    <p>
                      {timestampToHumanDateTZ(appointment.start)} {`All Day`}
                    </p>
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
