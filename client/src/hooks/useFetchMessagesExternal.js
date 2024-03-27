import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import xanoGet from "../api/xanoCRUD/xanoGet";
import { filterAndSortExternalMessages } from "../utils/messages/filterAndSortExternalMessages";

const useFetchMessagesExternal = (
  paging,
  search,
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
            "/messages_external_of_staff",
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
              `/messages_external/${messageId}`,
              "staff",
              null,
              abortController
            )
          ).data;
          setMessages((prevDatas) => {
            return filterAndSortExternalMessages(
              section,
              [...prevDatas, ...response.data.items, missingMessage],
              staffId
            );
          });
          navigate("/staff/messages");
        } else {
          setMessages((prevDatas) => {
            return filterAndSortExternalMessages(
              section,
              [...prevDatas, ...response.data.items],
              "staff",
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

export default useFetchMessagesExternal;
