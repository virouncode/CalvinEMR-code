import { useEffect } from "react";
import { onMessageClinic } from "../../socketHandlers/onMessageClinic";
import useClinicContext from "../context/useClinicContext";
import useSocketContext from "../context/useSocketContext";

const useClinicSocket = () => {
  const { socket } = useSocketContext();
  const { setClinic } = useClinicContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) => {
      onMessageClinic(message, setClinic);
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setClinic, socket]);
};

export default useClinicSocket;
