import { useEffect, useState } from "react";
import xanoGet from "../api/xanoCRUD/xanoGet";
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
          await xanoGet(
            "/messages_selected",
            axiosXanoStaff,
            auth.authToken,
            {
              messages_ids: message.previous_messages
                .filter(({ message_type }) => message_type === "Internal")
                .map(({ id }) => id),
            },
            abortController
          )
        ).data;
        const previousExternal = (
          await xanoGet(
            "/messages_external_selected",
            axiosXanoStaff,
            auth.authToken,
            {
              messages_ids: message.previous_messages
                .filter(({ message_type }) => message_type === "External")
                .map(({ id }) => id),
            },
            abortController
          )
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