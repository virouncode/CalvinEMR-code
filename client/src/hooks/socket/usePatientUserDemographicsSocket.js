import { useEffect } from "react";
import { onMessagePatientUserDemographics } from "../../socketHandlers/onMessagePatientUser";
import useSocketContext from "../context/useSocketContext";
import useUserContext from "../context/useUserContext";

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
