import { CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { getAvailableAppointments } from "../../../utils/getAvailableAppointments";
import AppointmentSlotItem from "./AppointmentSlotItem";

const AppointmentsSlots = ({
  availability,
  appointmentsInRange,
  practicianSelectedId,
  staffInfos,
  rangeStart,
  setAppointmentSelected,
  appointmentSelected,
}) => {
  const [appointmentsOptions, setAppointmentsOptions] = useState([]);
  useEffect(() => {
    setAppointmentsOptions(
      getAvailableAppointments(
        availability,
        appointmentsInRange,
        practicianSelectedId,
        rangeStart
      )
    );
  }, [appointmentsInRange, availability, practicianSelectedId, rangeStart]);
  return (
    availability &&
    appointmentsInRange && (
      <div className="new-appointments__content">
        {appointmentsOptions ? (
          appointmentsOptions.length ? (
            appointmentsOptions.map((appointment) => (
              <AppointmentSlotItem
                key={appointment.id}
                appointment={appointment}
                staffInfos={staffInfos}
                setAppointmentSelected={setAppointmentSelected}
                appointmentSelected={appointmentSelected}
              />
            ))
          ) : (
            <div>No appointments available this week</div>
          )
        ) : (
          <CircularProgress />
        )}
      </div>
    )
  );
};

export default AppointmentsSlots;
