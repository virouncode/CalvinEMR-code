import { useEffect } from "react";
import { onMessagesInbox } from "../../socketHandlers/onMessagesInbox";
import useSocketContext from "../context/useSocketContext";
import useUserContext from "../context/useUserContext";

const useMessagesSocket = (messages, setMessages, section) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessagesInbox(message, messages, setMessages, section, user.id);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [messages, section, setMessages, socket, user.id]);
};

export default useMessagesSocket;
