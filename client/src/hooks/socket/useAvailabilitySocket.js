import { useEffect } from "react";
import { onMessageAvailability } from "../../socketHandlers/onMessageAvailability";
import useSocketContext from "../context/useSocketContext";
import useUserContext from "../context/useUserContext";

const useAvailabilitySocket = (setAvailability) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageAvailability(
        message,
        setAvailability,
        user.demographics.assigned_staff_id
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setAvailability, socket, user.demographics.assigned_staff_id]);
};

export default useAvailabilitySocket;
