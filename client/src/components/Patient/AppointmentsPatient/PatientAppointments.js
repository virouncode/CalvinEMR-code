import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoPatient } from "../../../api/xanoPatient";
import useAuthContext from "../../../hooks/useAuthContext";
import { onMessagePatientAppointments } from "../../../utils/socketHandlers/onMessagePatientAppointments";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";
import NewAppointment from "./NewAppointment";
import NextAppointments from "./NextAppointments";
import PastAppointments from "./PastAppointments";

const PatientAppointments = () => {
  const { user, auth, socket } = useAuthContext();
  const [appointments, setAppointments] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAppointments = async () => {
      try {
        const response = await axiosXanoPatient.get(
          `/appointments_for_patient?patient_id=${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setAppointments(response.data);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(
            `Error : unable fetch your account infos: ${err.message}`,
            {
              containerId: "A",
            }
          );
      }
    };
    fetchAppointments();
    return () => abortController.abort();
  }, [auth.authToken, user.id]);

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessagePatientAppointments(
        message,
        appointments,
        setAppointments,
        user.id
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [appointments, socket, user.id]);

  return appointments ? (
    <>
      <div>
        <PastAppointments
          pastAppointments={appointments
            .filter(({ start }) => start < Date.now())
            .sort((a, b) => b.start - a.start)}
        />
        <NextAppointments
          nextAppointments={appointments
            .filter(({ start }) => start >= Date.now())
            .sort((a, b) => b.start - a.start)}
        />
      </div>
      <NewAppointment />{" "}
    </>
  ) : (
    <CircularProgressMedium />
  );
};

export default PatientAppointments;
