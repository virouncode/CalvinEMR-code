import { useContext } from "react";
import SocketContext from "../../context/SocketProvider";

const useSocketContext = () => {
  return useContext(SocketContext);
};

export default useSocketContext;
