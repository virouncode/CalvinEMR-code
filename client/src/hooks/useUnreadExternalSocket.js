import { useEffect } from "react";
import { onMessageUnreadExternal } from "../utils/socketHandlers/onMessageUnreadExternal";
import useSocketContext from "./useSocketContext";
import useUserContext from "./useUserContext";

const useUnreadExternalSocket = () => {
  const { socket } = useSocketContext();
  const { user, setUser } = useUserContext();
  useEffect(() => {
    if (!socket || user.access_level === "Admin") return;
    const onMessage = (message) => {
      onMessageUnreadExternal(
        message,
        user,
        setUser,
        user.access_level,
        user.id
      );
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setUser, socket, user]);
};

export default useUnreadExternalSocket;
