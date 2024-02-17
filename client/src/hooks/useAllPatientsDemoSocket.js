import { useEffect } from "react";
import { onMessageAllPatientsDemo } from "../utils/socketHandlers/onMessageAllPatientsDemo";
import useSocketContext from "./useSocketContext";

const useAllPatientsDemoSocket = (
  patientsDemographics,
  setPatientsDemographics
) => {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageAllPatientsDemo(
        message,
        patientsDemographics,
        setPatientsDemographics
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [patientsDemographics, setPatientsDemographics, socket]);
};

export default useAllPatientsDemoSocket;
