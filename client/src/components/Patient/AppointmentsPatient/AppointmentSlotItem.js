import React from "react";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";

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

const AppointmentSlotItem = ({
  appointment,
  staffInfos,
  setAppointmentSelected,
  appointmentSelected,
}) => {
  const handleCheck = (e) => {
    if (e.target.checked) setAppointmentSelected(appointment);
  };
  const isAppointmentSelected = (id) => appointmentSelected.id === id;
  return (
    <div key={appointment.id} className="new-appointments__content-item">
      <input
        type="checkbox"
        checked={isAppointmentSelected(appointment.id)}
        onChange={handleCheck}
      />
      <div className="new-appointments__content-item-date">
        <p>
          {new Date(appointment.start).toLocaleString("en-CA", optionsDate)}
        </p>
        <p>
          {new Date(appointment.start).toLocaleTimeString("en-CA", optionsTime)}{" "}
          - {new Date(appointment.end).toLocaleTimeString("en-CA", optionsTime)}
        </p>
      </div>
      <p>Reason : {appointment.reason}</p>
      <p>{staffIdToTitleAndName(staffInfos, appointment.host_id, true)}</p>
    </div>
  );
};

export default AppointmentSlotItem;
