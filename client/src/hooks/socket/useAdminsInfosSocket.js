import { useEffect } from "react";
import { onMessageAdminsInfos } from "../../socketHandlers/onMessageAdminsInfos";
import useAdminsInfosContext from "../context/useAdminsInfosContext";
import useSocketContext from "../context/useSocketContext";

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
