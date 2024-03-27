import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  nowTZTimestamp,
  timestampToHumanDateTZ,
  timestampToHumanDateTimeTZ,
} from "../../../utils/dates/formatDates";
import { staffIdToName } from "../../../utils/names/staffIdToName";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";

const NextAppointments = ({ nextAppointments, loading, err }) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [appointmentSelectedId, setAppointmentSelectedId] = useState(null);

  const isAppointmentSelected = (id) => appointmentSelectedId === id;
  const handleCheck = (e) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    if (checked) setAppointmentSelectedId(id);
    else setAppointmentSelectedId(null);
  };
  const handleDeleteAppointment = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to cancel this appointment ?",
      })
    ) {
      try {
        //get all secretaries id
        const secretariesIds = staffInfos
          .filter(({ title }) => title === "Secretary")
          .map(({ id }) => id);
        //create the message
        //send to all secretaries
        const appointment = nextAppointments.find(
          ({ id }) => id === appointmentSelectedId
        );

        for (const secretaryId of secretariesIds) {
          const message = {
            from_patient_id: user.id,
            to_staff_id: secretaryId,
            subject: "Appointment cancelation",
            body: `Hello ${staffIdToName(staffInfos, secretaryId)},

I would like to cancel my appointment with ${staffIdToTitleAndName(
              staffInfos,
              appointment.host_id
            )},

From ${timestampToHumanDateTimeTZ(
              appointment.start
            )} to ${timestampToHumanDateTimeTZ(appointment.end)}

Please contact me to confirm cancelation

Patient: ${user.full_name}
Chart Nbr: ${user.demographics.ChartNumber}
Cellphone: ${
              user.demographics.PhoneNumber.find(
                ({ _phoneNumberType }) => _phoneNumberType === "C"
              )?.phoneNumber
            }`,
            read_by_patient_id: user.id,
            date_created: nowTZTimestamp(),
            type: "External",
          };
          const response = await xanoPost(
            "/messages_external",
            "patient",

            message
          );
          socket.emit("message", {
            route: "MESSAGES INBOX EXTERNAL",
            action: "create",
            content: { data: response.data },
          });
          socket.emit("message", {
            route: "MESSAGES WITH PATIENT",
            action: "create",
            content: { data: response.data },
          });
        }
        window.alert(
          "YOUR CANCELATION IS NOT CONFIRMED YET. A secretary will contact you"
        );

        toast.success("Appointment cancelation request sent successfully", {
          containerId: "A",
        });

        setAppointmentSelectedId(null);
      } catch (err) {
        toast.error(`Unable to send appointment cancelation: ${err.message}`, {
          containerId: "A",
        });
      }
    }
  };

  return (
    <div className="appointments-patient">
      <div className="appointments-patient__title">Next Appointments</div>
      <div className="appointments-patient__content">
        {err && (
          <p className="appointments-patient__err">
            Unable to fetch next appointments
          </p>
        )}
        {!err && nextAppointments && nextAppointments.length > 0
          ? nextAppointments.map((appointment) => (
              <div key={appointment.id} className="appointments-patient__item">
                <div className="appointments-patient__date">
                  <input
                    type="checkbox"
                    checked={isAppointmentSelected(appointment.id)}
                    onChange={handleCheck}
                    id={appointment.id}
                  />
                  {!appointment.all_day ? (
                    <>
                      <div style={{ marginRight: "10px" }}>
                        {timestampToHumanDateTimeTZ(appointment.start)}{" "}
                      </div>
                      <div style={{ marginRight: "10px" }}>-</div>
                      <div>{timestampToHumanDateTimeTZ(appointment.end)}</div>
                    </>
                  ) : (
                    <div>
                      {timestampToHumanDateTZ(appointment.start)} {`All Day`}
                    </div>
                  )}
                </div>
                <p>Reason : {appointment.reason}</p>
                <p>{staffIdToTitleAndName(staffInfos, appointment.host_id)}</p>
              </div>
            ))
          : !loading && <EmptyParagraph text="No next appointments" />}
        {loading && <LoadingParagraph />}
      </div>
      <div className="appointments-patient__btn">
        <button
          onClick={handleDeleteAppointment}
          disabled={!appointmentSelectedId}
        >
          Cancel Appointment
        </button>
      </div>
    </div>
  );
};

export default NextAppointments;
