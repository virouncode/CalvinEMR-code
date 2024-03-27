import { useEffect } from "react";
import { onMessageUnreadExternal } from "../../socketHandlers/onMessageUnreadExternal";
import useSocketContext from "../context/useSocketContext";
import useUserContext from "../context/useUserContext";

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
