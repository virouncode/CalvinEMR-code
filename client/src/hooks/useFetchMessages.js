import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import xanoGet from "../api/xanoCRUD/xanoGet";
import { filterAndSortMessages } from "../utils/filterAndSortMessages";

const useFetchMessages = (paging, search, messageId, section, staffId) => {
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
      console.log("fetchmessages");
      console.log("paging", paging);
      try {
        let response;
        setLoading(true);
        setErrMsg("");
        if (section === "To-dos") {
          response = await xanoGet(
            "/todos_of_staff",
            "staff",
            {
              staff_id: staffId,
              search,
              paging,
            },
            abortController
          );
        } else {
          response = await xanoGet(
            "/messages_of_staff",
            "staff",
            {
              staff_id: staffId,
              search,
              paging,
            },
            abortController
          );
        }
        if (abortController.signal.aborted) return;
        if (
          messageId &&
          !response.data.items.find(({ id }) => id === messageId) //if the messageId in useParams isn't in the first page results
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
        console.log(response.data.items);
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
