import { useEffect } from "react";
import { onMessageEdocs } from "../../socketHandlers/onMessageEdocs";
import useSocketContext from "../context/useSocketContext";

const useEdocsSocket = (edocs, setEdocs) => {
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) => onMessageEdocs(message, edocs, setEdocs);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [edocs, setEdocs, socket]);
};

export default useEdocsSocket;
