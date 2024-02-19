import { useEffect, useState } from "react";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";
import useUserContext from "./useUserContext";

const useFetchClinicalNotes = (paging, patientId) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const [order, setOrder] = useState(user.settings.clinical_notes_order);
  const [clinicalNotes, setClinicalNotes] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    console.log("useEffect because of order");
    setClinicalNotes([]);
  }, [order]);

  useEffect(() => {
    console.log("useEffect because of the rest");
    const abortController = new AbortController();
    const fetchClinicalNotes = async () => {
      try {
        console.log("order", order);
        setLoading(true);
        setErrMsg("");
        const response = await axiosXanoStaff.get(
          "/clinical_notes_for_patient",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            params: {
              patient_id: patientId,
              paging,
              orderBy: order,
              columnName: "date_created",
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setClinicalNotes((prevDatas) => [...prevDatas, ...response.data.items]);
        setHasMore(response.data.items.length > 0);
        setLoading(false);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setErrMsg(err.message);
        }
        setLoading(false);
      }
    };
    fetchClinicalNotes();
    return () => abortController.abort();
  }, [auth.authToken, order, paging, patientId]);

  return {
    clinicalNotes,
    setClinicalNotes,
    order,
    setOrder,
    loading,
    errMsg,
    hasMore,
  };
};

export default useFetchClinicalNotes;
