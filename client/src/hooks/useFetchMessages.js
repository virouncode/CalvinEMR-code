import { useEffect, useState } from "react";

import xanoGet from "../api/xanoCRUD/xanoGet";
import { filterAndSortMessages } from "../utils/filterAndSortMessages";

const useFetchMessages = (paging, search, sectionName, section, staffId) => {
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setMessages([]);
  }, [search, section]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const response = await xanoGet(
          "/messages_of_staff",
          "staff",
          {
            staff_id: staffId,
            search,
            paging,
          },
          abortController
        );
        if (abortController.signal.aborted) return;
        setMessages((prevDatas) => {
          return filterAndSortMessages(
            sectionName || section,
            [...prevDatas, ...response.data.items],
            staffId
          );
        });
        setHasMore(response.data.items.length > 0);
        setLoading(false);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.log(err);
          setErrMsg(err.message);
        }
        setLoading(false);
      }
    };
    fetchMessages();
    return () => {
      abortController.abort();
    };
  }, [paging, search, section, sectionName, staffId]);

  return {
    messages,
    setMessages,
    loading,
    errMsg,
    hasMore,
  };
};

export default useFetchMessages;
