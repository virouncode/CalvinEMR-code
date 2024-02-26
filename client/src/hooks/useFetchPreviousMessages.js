import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";

const useFetchPreviousMessages = (message) => {
  const [previousMsgs, setPreviousMsgs] = useState([]);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const { auth } = useAuthContext();

  useEffect(() => {
    if (!message) return;
    const abortController = new AbortController();
    const fetchPreviousMsgs = async () => {
      try {
        setLoadingPrevious(true);
        //Previous Internal messages
        const response = await axiosXanoStaff.post(
          "/messages_selected",
          {
            messages_ids: message.previous_messages
              .filter((previousMsg) => previousMsg.message_type === "Internal")
              .map((message) => message.id),
          },
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
              "Content-Type": "application/json",
            },
            signal: abortController.signal,
          }
        );
        //Previous External Messages
        const response2 = await axiosXanoStaff.post(
          "/messages_external_selected",
          {
            messages_ids: message.previous_messages
              .filter((previousMsg) => previousMsg.message_type === "External")
              .map((message) => message.id),
          },
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
              "Content-Type": "application/json",
            },
            signal: abortController.signal,
          }
        );

        if (abortController.signal.aborted) return;
        setPreviousMsgs(
          [...response.data, ...response2.data].sort(
            (a, b) => b.date_created - a.date_created
          )
        );
        setLoadingPrevious(false);
      } catch (err) {
        setLoadingPrevious(false);
        if (err.name !== "CanceledError")
          toast.error(
            `Error: unable to fetch previous messages: ${err.message}`,
            { containerId: "A" }
          );
      }
    };
    fetchPreviousMsgs();
    return () => abortController.abort();
  }, [auth.authToken, message]);

  return { previousMsgs, setPreviousMsgs, loadingPrevious };
};

export default useFetchPreviousMessages;
