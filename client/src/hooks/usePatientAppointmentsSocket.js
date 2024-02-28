import { useEffect } from "react";
import { onMessagePatientAppointments } from "../utils/socketHandlers/onMessagePatientAppointments";
import useSocketContext from "./useSocketContext";
import useUserContext from "./useUserContext";

const usePatientAppointmentsSocket = (appointments, setAppointments) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
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
  }, [appointments, setAppointments, socket, user.id]);
};

export default usePatientAppointmentsSocket;
