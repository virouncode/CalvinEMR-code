import { useEffect, useState } from "react";
import { axiosXanoStaff } from "../api/xanoStaff";
import { filterAndSortMessages } from "../utils/filterAndSortMessages";
import useAuthContext from "./useAuthContext";

const useFetchMessages = (paging, search, sectionName, section, staffId) => {
  const { auth } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const abortController = new AbortController();
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const response = await axiosXanoStaff.get("/messages_for_staff", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          params: {
            staff_id: staffId,
            paging,
            search,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        setMessages((prevDatas) =>
          filterAndSortMessages(
            sectionName || section,
            [...prevDatas, ...response.data.items],
            staffId
          )
        );
        setHasMore(response.data.items.length > 0);
        setLoading(false);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setErrMsg(err.message);
        }
        setLoading(false);
      }
    };
    fetchMessages();
    return () => {
      abortController.abort();
      setMessages(null);
    };
  }, [auth.authToken, paging, search, section, sectionName, staffId]);

  return {
    messages,
    setMessages,
    loading,
    errMsg,
    hasMore,
  };
};

export default useFetchMessages;