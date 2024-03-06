import { useEffect, useState } from "react";
import xanoGet from "../api/xanoCRUD/xanoGet";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";

const useFetchStaffReports = (paging, staffId) => {
  const { auth } = useAuthContext();
  const [reports, setReports] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const abortController = new AbortController();
    const fetchStaffReports = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const response = await xanoGet(
          "/reports_of_staff",
          axiosXanoStaff,
          auth.authToken,
          {
            staff_id: staffId,
            paging,
          },
          abortController
        );
        if (abortController.signal.aborted) return;
        setReports((prevDatas) => [...prevDatas, ...response.data.items]);
        setHasMore(response.data.items.length > 0);
        setLoading(false);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setErrMsg(err.message);
        }
        setLoading(false);
      }
    };
    fetchStaffReports();
    return () => abortController.abort();
  }, [auth.authToken, paging, staffId]);

  return {
    reports,
    setReports,
    loading,
    errMsg,
    hasMore,
  };
};

export default useFetchStaffReports;
