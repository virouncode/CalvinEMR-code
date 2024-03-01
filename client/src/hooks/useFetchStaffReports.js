import { useEffect, useState } from "react";
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
        const response = await axiosXanoStaff.get("/reports_of_staff", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          params: {
            staff_id: staffId,
            paging,
          },
          signal: abortController.signal,
        });
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
