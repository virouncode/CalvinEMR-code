import { useEffect } from "react";
import { onMessageSites } from "../utils/socketHandlers/onMessageSites";
import useSocketContext from "./useSocketContext";

const useSitesSocket = (sites, setSites) => {
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) => onMessageSites(message, sites, setSites);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setSites, sites, socket]);
};

export default useSitesSocket;
