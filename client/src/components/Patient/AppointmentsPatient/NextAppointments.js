import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoPatient } from "../../../api/xanoPatient";
import useAuth from "../../../hooks/useAuth";
import { staffIdToName } from "../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";

const NextAppointments = ({ nextAppointments }) => {
  const { user, auth, clinic, socket } = useAuth();
  const [appointmentSelectedId, setAppointmentSelectedId] = useState(null);

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
        const secretariesIds = clinic.staffInfos
          .filter(({ title }) => title === "Secretary")
          .map(({ id }) => id);
        //create the message
        //send to all secretaries
        const appointment = nextAppointments.find(
          ({ id }) => id === appointmentSelectedId
        );

        for (const secretaryId of secretariesIds) {
          const message = {
            from_id: user.id,
            from_user_type: "patient",
            to_id: secretaryId,
            to_user_type: "staff",
            subject: "Appointment cancelation",
            body: `Hello ${staffIdToName(clinic.staffInfos, secretaryId)},

I would like to cancel my appointment with ${staffIdToTitleAndName(
              clinic.staffInfos,
              appointment.host_id
            )} on:

${new Date(appointment.start).toLocaleString("en-CA", optionsDate)} ${new Date(
              appointment.start
            ).toLocaleTimeString("en-CA", optionsTime)} - ${new Date(
              appointment.end
            ).toLocaleTimeString("en-CA", optionsTime)}

Please contact me to confirm cancelation

Patient: ${user.demographics.full_name}
Chart Nbr: ${user.demographics.chart_nbr}
Cellphone: ${user.demographics.cell_phone}`,
            read_by_patient_id: user.id,
            date_created: Date.now(),
            type: "External",
          };
          const response = await axiosXanoPatient.post(
            "/messages_external",
            message,
            {
              headers: {
                Authorization: `Bearer ${auth.authToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          socket.emit("message", {
            route: "MESSAGES INBOX EXTERNAL",
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
        {nextAppointments ? (
          nextAppointments.length ? (
            nextAppointments.map((appointment) => (
              <div key={appointment.id} className="appointments-patient__item">
                <input
                  type="checkbox"
                  checked={isAppointmentSelected(appointment.id)}
                  onChange={handleCheck}
                  id={appointment.id}
                />
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
                <p>Reason : {appointment.reason}</p>
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
            <div>No next appointments</div>
          )
        ) : (
          <CircularProgress />
        )}
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
