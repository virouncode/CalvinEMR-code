import { useEffect } from "react";
import { onMessageTodos } from "../utils/socketHandlers/onMessageTodos";
import useSocketContext from "./useSocketContext";
import useUserContext from "./useUserContext";

const useTodosSocket = (todos, setTodos) => {
  const { socket } = useSocketContext();
  const { user } = useUserContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageTodos(message, todos, setTodos, user.id);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setTodos, socket, todos, user.id]);
};

export default useTodosSocket;
