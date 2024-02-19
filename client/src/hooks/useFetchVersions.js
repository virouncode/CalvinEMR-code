import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";

const useFetchVersions = (patientId, clinicalNoteId) => {
  const { auth } = useAuthContext();
  const [versions, setVersions] = useState([]);
  const [versionsLoading, setVersionsLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchVersions = async () => {
      try {
        setVersionsLoading(true);
        const versionsResults = (
          await axiosXanoStaff.get("/clinical_notes_log_for_clinical_note_id", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            params: {
              patient_id: patientId,
              clinical_note_id: clinicalNoteId,
            },
            ...(abortController && { signal: abortController.signal }),
          })
        ).data;

        if (abortController.signal.aborted) {
          setVersionsLoading(false);
          return;
        }
        versionsResults.forEach(
          (version) => (version.id = version.clinical_note_id) //change id field value to clinical_note_id value to match progress_notes fields
        );
        versionsResults.sort((a, b) => a.version_nbr - b.version_nbr);

        setVersions(versionsResults);
        setVersionsLoading(false);
      } catch (err) {
        setVersionsLoading(false);
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to fetch versions: ${err.message}`, {
            containerId: "A",
          });
      }
    };
    fetchVersions();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken, clinicalNoteId, patientId]);
  return { versions, setVersions, versionsLoading, setVersionsLoading };
};

export default useFetchVersions;
