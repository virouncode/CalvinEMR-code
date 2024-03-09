import { useEffect, useState } from "react";
import xanoGet from "../api/xanoCRUD/xanoGet";
import { filterAndSortExternalMessages } from "../utils/filterAndSortExternalMessages";

const useFetchMessagesPatient = (
  paging,
  search,
  section,
  patientId,
  userType
) => {
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
          "/messages_external_of_patient",
          "patient",
          {
            patient_id: patientId,
            search,
            paging,
          },
          abortController
        );
        if (abortController.signal.aborted) return;
        setMessages((prevDatas) => {
          return filterAndSortExternalMessages(
            section,
            [...prevDatas, ...response.data.items],
            userType,
            patientId
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
  }, [paging, patientId, search, section, userType]);

  return {
    messages,
    setMessages,
    loading,
    errMsg,
    hasMore,
  };
};

export default useFetchMessagesPatient;
