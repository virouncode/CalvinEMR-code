import { useEffect } from "react";
import { onMessageEvents } from "../../socketHandlers/onMessageEvents";
import useSocketContext from "../context/useSocketContext";
import useStaffInfosContext from "../context/useStaffInfosContext";
import useUserContext from "../context/useUserContext";

const useEventsSocket = (events, setEvents, sites) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageEvents(
        message,
        events,
        setEvents,
        staffInfos,
        user.id,
        user.title === "Secretary",
        sites
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [events, setEvents, sites, socket, staffInfos, user.id, user.title]);
};

export default useEventsSocket;
