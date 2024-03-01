import { useEffect, useState } from "react";
import { axiosXanoStaff } from "../api/xanoStaff";
import { filterAndSortExternalMessages } from "../utils/filterAndSortExternalMessages";
import useAuthContext from "./useAuthContext";

const useFetchMessagesExternal = (
  paging,
  search,
  sectionName,
  section,
  staffId,
  userType
) => {
  const { auth } = useAuthContext();
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
        const response = await axiosXanoStaff.get(
          "/messages_external_of_staff",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            params: {
              staff_id: staffId,
              search,
              paging,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setMessages((prevDatas) => {
          return filterAndSortExternalMessages(
            sectionName || section,
            [...prevDatas, ...response.data.items],
            userType,
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
  }, [auth.authToken, paging, search, section, sectionName, staffId, userType]);

  return {
    messages,
    setMessages,
    loading,
    errMsg,
    hasMore,
  };
};

export default useFetchMessagesExternal;
