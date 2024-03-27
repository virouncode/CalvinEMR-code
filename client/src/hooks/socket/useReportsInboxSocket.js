import { useEffect } from "react";
import { onMessageReportsInbox } from "../../socketHandlers/onMessageReportsInbox";
import useSocketContext from "../context/useSocketContext";

const useReportsInboxSocket = (reports, setReports, userId) => {
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageReportsInbox(message, reports, setReports, userId, false);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [reports, setReports, socket, userId]);
};

export default useReportsInboxSocket;
