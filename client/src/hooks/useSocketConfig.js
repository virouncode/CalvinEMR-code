import { useEffect } from "react";
import socketIOClient from "socket.io-client";
import useSocketContext from "./context/useSocketContext";
const MY_URL = "https://desolate-falls-54368-86c7ea576f1b.herokuapp.com/";

const useSocketConfig = (dev) => {
  const { setSocket } = useSocketContext();
  useEffect(() => {
    const socket = socketIOClient(dev ? "http://localhost:3000" : MY_URL);
    setSocket(socket);
    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useSocketConfig;
