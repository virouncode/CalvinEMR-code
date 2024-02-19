import { useEffect } from "react";
import { onMessageClinicalTemplates } from "../utils/socketHandlers/onMessageClinicalTemplates";
import useSocketContext from "./useSocketContext";

const useClinicalTemplatesSocket = (
  clinicalTemplates,
  setClinicalTemplates
) => {
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageClinicalTemplates(
        message,
        clinicalTemplates,
        setClinicalTemplates
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [clinicalTemplates, setClinicalTemplates, socket]);
};

export default useClinicalTemplatesSocket;
