import { useEffect, useState } from "react";
import { axiosXanoPatient } from "../api/xanoPatient";
import { filterAndSortExternalMessages } from "../utils/filterAndSortExternalMessages";
import useAuthContext from "./useAuthContext";

const useFetchMessagesPatient = (
  paging,
  search,
  section,
  patientId,
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
        const response = await axiosXanoPatient.get(
          "/messages_external_for_patient",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            params: {
              patient_id: patientId,
              search,
              paging,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setMessages((prevDatas) => {
          console.log("prevDatas", prevDatas);
          console.log("response", response.data.items);
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
  }, [auth.authToken, paging, patientId, search, section, userType]);

  return {
    messages,
    setMessages,
    loading,
    errMsg,
    hasMore,
  };
};

export default useFetchMessagesPatient;
