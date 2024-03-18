import React from "react";
import useFetchPatientAppointments from "../../../hooks/useFetchPatientAppointments";
import usePatientAppointmentsSocket from "../../../hooks/usePatientAppointmentsSocket";
import { nowTZTimestamp } from "../../../utils/formatDates";
import NewAppointment from "./NewAppointment";
import NextAppointments from "./NextAppointments";
import PastAppointments from "./PastAppointments";

const PatientAppointments = () => {
  const { appointments, loading, err } = useFetchPatientAppointments();
  usePatientAppointmentsSocket();

  return (
    <>
      <div>
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
