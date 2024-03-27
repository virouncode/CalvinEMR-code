import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import xanoGet from "../api/xanoCRUD/xanoGet";
import useUserContext from "./context/useUserContext";

const useFetchDiagnosisList = (search, paging) => {
  const { user } = useUserContext();
  const [diagnosis, setDiagnosis] = useState([]);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const userType = user.access_level === "Admin" ? "admin" : "staff";

  useEffect(() => {
    setDiagnosis([]);
  }, [search]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchDiagnosis = async () => {
      try {
        setLoading(true);
        const response = await xanoGet(
          "/diagnosis_codes_search",
          userType,
          {
            search,
            paging,
          },
          abortController
        );
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
  }, [paging, search, userType]);

  return { loading, err, diagnosis, setDiagnosis, hasMore };
};

export default useFetchDiagnosisList;
