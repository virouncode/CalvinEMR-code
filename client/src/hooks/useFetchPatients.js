import { useEffect, useState } from "react";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";

const useFetchPatients = (paging) => {
  const { auth } = useAuthContext();
  const [patients, setPatients] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const abortController = new AbortController();
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const response = await axiosXanoStaff.get(
          "/patients_names_ids_gender",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            params: {
              paging,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setPatients((prevDatas) => [...prevDatas, ...response.data.items]);
        setHasMore(response.data.items.length > 0);
        setLoading(false);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setErrMsg(err.message);
        }
        setLoading(false);
      }
    };
    fetchPatients();
    return () => abortController.abort();
  }, [auth.authToken, paging]);

  return {
    patients,
    loading,
    errMsg,
    hasMore,
  };
};

export default useFetchPatients;
