import { useEffect } from "react";
import { onMessageBillingTemplates } from "../../socketHandlers/onMessageBillingTemplate";
import useSocketContext from "../context/useSocketContext";

const useBillingTemplatesSocket = (billingTemplates, setBillingTemplates) => {
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageBillingTemplates(message, billingTemplates, setBillingTemplates);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [billingTemplates, setBillingTemplates, socket]);
};

export default useBillingTemplatesSocket;
