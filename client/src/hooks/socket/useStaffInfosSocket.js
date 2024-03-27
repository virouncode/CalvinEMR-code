import { useEffect } from "react";
import { onMessageStaffInfos } from "../../socketHandlers/onMessageStaffInfos";
import useSocketContext from "../context/useSocketContext";
import useStaffInfosContext from "../context/useStaffInfosContext";

const useStaffInfosSocket = () => {
  const { socket } = useSocketContext();
  const { staffInfos, setStaffInfos } = useStaffInfosContext();

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) => {
      onMessageStaffInfos(message, staffInfos, setStaffInfos);
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setStaffInfos, socket, staffInfos]);
};

export default useStaffInfosSocket;
