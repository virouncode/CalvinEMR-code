import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";

const useFetchAttachmentsForClinicalNote = (attachmentsIds) => {
  const { auth } = useAuthContext();
  const [attachments, setAttachments] = useState([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAttachments = async () => {
      try {
        setAttachmentsLoading(true);
        const response = (
          await axiosXanoStaff.get("/attachments_for_clinical_note", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            params: { attachments_ids: attachmentsIds },
            signal: abortController.signal,
          })
        ).data;
        if (abortController.signal.aborted) {
          setAttachmentsLoading(false);
          return;
        }
        setAttachments(
          response.sort((a, b) => a.date_created - b.date_created)
        );
        setAttachmentsLoading(false);
      } catch (err) {
        setAttachmentsLoading(false);
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
  }, [attachmentsIds, auth.authToken]);
  return {
    attachments,
    setAttachments,
    attachmentsLoading,
    setAttachmentsLoading,
  };
};

export default useFetchAttachmentsForClinicalNote;
