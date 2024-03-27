import React from "react";
import usePatientAppointmentsSocket from "../../../hooks/socket/usePatientAppointmentsSocket";
import useFetchPatientAppointments from "../../../hooks/useFetchPatientAppointments";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import NewAppointment from "./NewAppointment";
import NextAppointments from "./NextAppointments";
import PastAppointments from "./PastAppointments";

const PatientAppointments = () => {
  const { appointments, loading, err } = useFetchPatientAppointments();
  usePatientAppointmentsSocket();

  return (
    <>
      <div className="past-next-appointments">
        <PastAppointments
          pastAppointments={appointments
            .filter(({ start }) => start < nowTZTimestamp())
            .sort((a, b) => b.start - a.start)}
          loading={loading}
          err={err}
        />
        <NextAppointments
          nextAppointments={appointments
            .filter(({ start }) => start >= nowTZTimestamp())
            .sort((a, b) => b.start - a.start)}
          loading={loading}
          err={err}
        />
      </div>
      <NewAppointment />{" "}
    </>
  );
};

export default PatientAppointments;
