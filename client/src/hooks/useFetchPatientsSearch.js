import { useEffect, useState } from "react";

import xanoGet from "../api/xanoCRUD/xanoGet";

const useFetchPatientsSearch = (paging, search) => {
  const [patients, setPatients] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setPatients([]);
  }, [search]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const response = await xanoGet(
          "/patients_names_ids_gender_search",
          "staff",
          { paging, search },
          abortController
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
  }, [paging, search]);

  return {
    patients,
    loading,
    errMsg,
    hasMore,
  };
};

export default useFetchPatientsSearch;
