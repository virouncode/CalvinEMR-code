import { useEffect } from "react";
import { onMessageUnread } from "../utils/socketHandlers/onMessageUnread";
import useSocketContext from "./useSocketContext";
import useUserContext from "./useUserContext";

const useMessagesUnreadSocket = () => {
  const { socket } = useSocketContext();
  const { user, setUser } = useUserContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) => onMessageUnread(message, user, setUser);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setUser, socket, user]);
};

export default useMessagesUnreadSocket;
