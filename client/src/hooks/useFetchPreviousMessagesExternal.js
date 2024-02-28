import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoPatient } from "../api/xanoPatient";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";

const useFetchPreviousMessagesExternal = (message, userType) => {
  const axiosXanoInstance =
    userType === "staff" ? axiosXanoStaff : axiosXanoPatient;
  const { auth } = useAuthContext();
  const [previousMsgs, setPreviousMsgs] = useState([]);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  useEffect(() => {
    if (!message) return;
    const abortController = new AbortController();
    const fetchPreviousMsgs = async () => {
      try {
        setLoadingPrevious(true);
        const response = await axiosXanoInstance.post(
          "/messages_external_selected",
          { messages_ids: message.previous_messages_ids },
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
          response.data.sort((a, b) => b.date_created - a.date_created)
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
  return { previousMsgs, setPreviousMsgs, loadingPrevious, setLoadingPrevious };
};

export default useFetchPreviousMessagesExternal;
