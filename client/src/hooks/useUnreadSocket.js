import { useEffect } from "react";
import { onMessageUnread } from "../utils/socketHandlers/onMessageUnread";
import useSocketContext from "./useSocketContext";
import useUserContext from "./useUserContext";

const useUnreadSocket = () => {
  console.log("socket unread called");
  const { socket } = useSocketContext();
  const { user, setUser } = useUserContext();
  useEffect(() => {
    console.log(user.access_level);
    if (!socket || user.access_level !== "Staff") return;
    console.log("socket unread ok");
    const onMessage = (message) => {
      onMessageUnread(message, user, setUser, user.access_level, user.id);
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setUser, socket, user]);
};

export default useUnreadSocket;
