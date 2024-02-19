import { useEffect } from "react";
import { onMessageVersions } from "../utils/socketHandlers/onMessageVersions";
import useSocketContext from "./useSocketContext";

const useVersionsSocket = (versions, setVersions, clinicalNoteId) => {
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket || !versions) return;
    const onMessage = (message) =>
      onMessageVersions(message, setVersions, clinicalNoteId);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [clinicalNoteId, setVersions, socket, versions]);
};

export default useVersionsSocket;
