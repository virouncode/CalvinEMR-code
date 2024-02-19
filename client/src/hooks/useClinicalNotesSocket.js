import { useEffect } from "react";
import { onMessageClinicalNotes } from "../utils/socketHandlers/onMessageClinicalNotes";
import useSocketContext from "./useSocketContext";

const useClinicalNotesSocket = (
  clinicalNotes,
  setClinicalNotes,
  patientId,
  order
) => {
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageClinicalNotes(
        message,
        clinicalNotes,
        setClinicalNotes,
        patientId,
        order
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [clinicalNotes, order, patientId, setClinicalNotes, socket]);
};

export default useClinicalNotesSocket;
