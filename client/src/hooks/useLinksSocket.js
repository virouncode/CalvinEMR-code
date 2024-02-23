import { useEffect } from "react";
import { onMessageLinks } from "../utils/socketHandlers/onMessageLinks";
import useSocketContext from "./useSocketContext";

const useLinksSocket = (links, setLinks, userId) => {
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageLinks(message, links, setLinks, userId);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [links, setLinks, socket, userId]);
};

export default useLinksSocket;
