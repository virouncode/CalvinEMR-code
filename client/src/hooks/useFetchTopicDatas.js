import { useEffect, useState } from "react";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";

const useFetchTopicDatas = (url, paging, patientId) => {
  const { auth } = useAuthContext();
  const [topicDatas, setTopicDatas] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (!url) return;
    const abortController = new AbortController();
    const fetchTopicDatas = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const response = await axiosXanoStaff.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          params: {
            patient_id: patientId,
            paging,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        setTopicDatas((prevDatas) => [...prevDatas, ...response.data.items]);
        setHasMore(response.data.items.length > 0);
        setLoading(false);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setErrMsg(err.message);
        }
        setLoading(false);
      }
    };
    fetchTopicDatas();
    return () => abortController.abort();
  }, [auth.authToken, paging, patientId, url]);

  return {
    topicDatas,
    setTopicDatas,
    loading,
    errMsg,
    hasMore,
  };
};

export default useFetchTopicDatas;
