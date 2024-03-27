import { useEffect } from "react";
import { onMessageClinicalTemplates } from "../../socketHandlers/onMessageClinicalTemplates";
import useSocketContext from "../context/useSocketContext";

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
