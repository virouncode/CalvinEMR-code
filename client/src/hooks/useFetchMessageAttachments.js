import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoPatient } from "../api/xanoPatient";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";

const useFetchMessageAttachments = (message, userType) => {
  const axiosXanoInstance =
    userType === "staff" ? axiosXanoStaff : axiosXanoPatient;
  const [attachments, setAttachments] = useState([]);
  const { auth } = useAuthContext();
  useEffect(() => {
    const abortController = new AbortController();
    const fetchAttachments = async () => {
      try {
        const response = (
          await axiosXanoInstance.post(
            "/attachments_for_message",
            { attachments_ids: message?.attachments_ids },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.authToken}`,
              },
              signal: abortController.signal,
            }
          )
        ).data;
        if (abortController.signal.aborted) return;
        setAttachments(response);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to fetch attachments: ${err.message}`, {
            containerId: "A",
          });
      }
    };
    fetchAttachments();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken, message?.attachments_ids]);

  return { attachments, setAttachments };
};

export default useFetchMessageAttachments;
