import { useEffect, useState } from "react";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";
import useUserContext from "./useUserContext";

const useFetchClinicalNotes = (patientId) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const [order, setOrder] = useState(user.settings.clinical_notes_order);
  const [search, setSearch] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [paging, setPaging] = useState({ page: 1, perPage: 5, offset: 0 });

  useEffect(() => {
    setClinicalNotes([]);
  }, [order, search]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchClinicalNotes = async () => {
      try {
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
              search,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setClinicalNotes((prevDatas) => [...prevDatas, ...response.data.items]);
        setHasMore(response.data.items.length > 0);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.name !== "CanceledError") {
          setErrMsg(err.message);
        }
      }
    };
    fetchClinicalNotes();
    return () => abortController.abort();
  }, [auth.authToken, order, paging, patientId, search]);

  return {
    order,
    setOrder,
    search,
    setSearch,
    clinicalNotes,
    setClinicalNotes,
    loading,
    errMsg,
    hasMore,
    setPaging,
    paging,
  };
};

export default useFetchClinicalNotes;
