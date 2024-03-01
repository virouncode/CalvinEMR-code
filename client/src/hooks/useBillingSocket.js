import { useEffect } from "react";
import { onMessageBilling } from "../utils/socketHandlers/onMessageBilling";
import useSocketContext from "./useSocketContext";
import useUserContext from "./useUserContext";

const useBillingSocket = (billings, setBillings) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageBilling(
        message,
        billings,
        setBillings,
        user.id,
        user.title === "Secretary",
        user.access_level === "Admin"
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [billings, setBillings, socket, user.id, user.title, user.access_level]);
};

export default useBillingSocket;
