import { useEffect } from "react";
import { onMessageTopic } from "../utils/socketHandlers/onMessageTopic";
import useSocketContext from "./useSocketContext";

const useTopicSocket = (topic, topicDatas, setTopicDatas, patientId) => {
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) => {
      onMessageTopic(message, topic, topicDatas, setTopicDatas, patientId);
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [patientId, setTopicDatas, socket, topic, topicDatas]);
};

export default useTopicSocket;
