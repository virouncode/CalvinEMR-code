import { useEffect } from "react";
import { onMessageClinic } from "../utils/socketHandlers/onMessageClinic";
import useClinicContext from "./useClinicContext";
import useSocketContext from "./useSocketContext";

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
