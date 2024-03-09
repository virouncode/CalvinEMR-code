import { useEffect, useState } from "react";

import xanoGet from "../api/xanoCRUD/xanoGet";

const useFetchTopicDatas = (url, paging, patientId) => {
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
        const response = await xanoGet(
          url,
          "staff",
          {
            patient_id: patientId,
            paging,
          },
          abortController
        );
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
  }, [paging, patientId, url]);

  return {
    topicDatas,
    setTopicDatas,
    loading,
    errMsg,
    hasMore,
  };
};

export default useFetchTopicDatas;
