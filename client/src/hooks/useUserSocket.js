import { useEffect } from "react";
import { onMessageUser } from "../utils/socketHandlers/onMessageUser";
import useSocketContext from "./useSocketContext";
import useUserContext from "./useUserContext";

const useUserSocket = () => {
  const { socket } = useSocketContext();
  const { user, setUser } = useUserContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) => {
      onMessageUser(message, user, setUser, user.access_level, user.id);
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setUser, socket, user]);
};

export default useUserSocket;
