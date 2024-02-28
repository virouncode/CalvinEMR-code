import { useEffect } from "react";
import { onMessagePatientUserDemographics } from "../utils/socketHandlers/onMessagePatientUser";
import useSocketContext from "./useSocketContext";
import useUserContext from "./useUserContext";

const usePatientUserDemographicsSocket = (userId) => {
  const { socket } = useSocketContext();
  const { user, setUser } = useUserContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessagePatientUserDemographics(message, user, setUser, userId);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setUser, socket, user, userId]);
};

export default usePatientUserDemographicsSocket;
