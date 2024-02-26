import { useEffect } from "react";
import { onMessagesInboxExternal } from "../utils/socketHandlers/onMessagesInboxExternal";
import useSocketContext from "./useSocketContext";
import useUserContext from "./useUserContext";

const useMessagesExternalSocket = (
  messages,
  setMessages,
  section,
  userType
) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessagesInboxExternal(
        message,
        messages,
        setMessages,
        section,
        user.id,
        userType
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [messages, section, setMessages, socket, user.id, userType]);
};

export default useMessagesExternalSocket;
