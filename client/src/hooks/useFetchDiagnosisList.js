import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";

const useFetchDiagnosisList = (search, paging) => {
  const { auth } = useAuthContext();
  const [diagnosis, setDiagnosis] = useState([]);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setDiagnosis([]);
  }, [search]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchDiagnosis = async () => {
      try {
        setLoading(true);
        const response = await axiosXanoStaff.get(`/diagnosis_codes_search`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          params: {
            search,
            paging,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        setDiagnosis((prevDatas) => [...prevDatas, ...response.data.items]);
        setHasMore(response.data.items.length > 0);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.name !== "CanceledError") {
          toast.error(`Unable to fetch diagnosis codes: ${err.message}`, {
            containerId: "A",
          });
          setErr(true);
        }
      }
    };
    fetchDiagnosis();
    return () => abortController.abort();
  }, [auth.authToken, paging, search]);

  return { loading, err, diagnosis, setDiagnosis, hasMore };
};

export default useFetchDiagnosisList;
