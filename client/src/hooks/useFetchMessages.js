import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import xanoGet from "../api/xanoCRUD/xanoGet";
import { filterAndSortMessages } from "../utils/filterAndSortMessages";

const useFetchMessages = (
  paging,
  search,
  sectionName,
  messageId,
  section,
  staffId
) => {
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

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
        if (
          messageId &&
          !response.data.items.find(({ id }) => id === messageId)
        ) {
          const missingMessage = (
            await xanoGet(
              `/messages/${messageId}`,
              "staff",
              null,
              abortController
            )
          ).data;
          setMessages((prevDatas) => {
            return filterAndSortMessages(
              section,
              [...prevDatas, ...response.data.items, missingMessage],
              staffId
            );
          });
          navigate("/staff/messages");
        } else {
          setMessages((prevDatas) => {
            return filterAndSortMessages(
              section,
              [...prevDatas, ...response.data.items],
              staffId
            );
          });
        }
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
  }, [messageId, navigate, paging, search, section, staffId]);

  return {
    messages,
    setMessages,
    loading,
    errMsg,
    hasMore,
  };
};

export default useFetchMessages;
