import { useEffect } from "react";
import { onMessagePatientDemo } from "../../socketHandlers/onMessagePatientDemo";
import useSocketContext from "../context/useSocketContext";

const usePatientDemoSocket = (demographicsInfos, setDemographicsInfos) => {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessagePatientDemo(
        message,
        setDemographicsInfos,
        demographicsInfos.patient_id
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [demographicsInfos.patient_id, setDemographicsInfos, socket]);
};

export default usePatientDemoSocket;
