import { useEffect, useState } from "react";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";

const useFetchPreviousMessages = (message) => {
  const { auth } = useAuthContext();
  const [previousMessages, setPreviousMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const abortController = new AbortController();
    const fetchPreviousMessages = async () => {
      try {
        setLoading(true);
        const previousInternal = (
          await axiosXanoStaff.get("/messages_selected", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            params: {
              messages_ids: message.previous_messages
                .filter(({ message_type }) => message_type === "Internal")
                .map(({ id }) => id),
            },
            signal: abortController.signal,
          })
        ).data;
        const previousExternal = (
          await axiosXanoStaff.get("/messages_external_selected", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            params: {
              messages_ids: message.previous_messages
                .filter(({ message_type }) => message_type === "External")
                .map(({ id }) => id),
            },
            signal: abortController.signal,
          })
        ).data;
        if (abortController.signal.aborted) return;
        setLoading(false);
        setPreviousMessages(
          [...previousInternal, ...previousExternal].sort(
            (a, b) => b.date_created - a.date_created
          )
        );
      } catch (errMsg) {
        if (errMsg.name !== "CanceledError") {
          setErrMsg(
            `Error: unable to get previuos messages: ${errMsg.message}`
          );
        }
        setLoading(false);
      }
    };
    fetchPreviousMessages();
    return () => abortController.abort();
  }, [auth.authToken, message.previous_messages]);

  return [previousMessages, loading, errMsg];
};

export default useFetchPreviousMessages;
