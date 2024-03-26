import { useEffect } from "react";
import { onMessageAdminsInfos } from "../utils/socketHandlers/onMessageAdminsInfos";
import useAdminsInfosContext from "./useAdminsInfosContext";
import useSocketContext from "./useSocketContext";

const useAdminsInfosSocket = () => {
  const { socket } = useSocketContext();
  const { adminsInfos, setAdminsInfos } = useAdminsInfosContext();

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) => {
      onMessageAdminsInfos(message, adminsInfos, setAdminsInfos);
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [adminsInfos, setAdminsInfos, socket]);
};

export default useAdminsInfosSocket;
