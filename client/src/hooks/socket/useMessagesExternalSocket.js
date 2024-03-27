import { useEffect } from "react";
import { onMessagesInboxExternal } from "../../socketHandlers/onMessagesInboxExternal";
import useSocketContext from "../context/useSocketContext";
import useUserContext from "../context/useUserContext";

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
