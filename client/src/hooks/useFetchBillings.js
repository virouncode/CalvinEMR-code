import { useEffect, useState } from "react";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";
import useUserContext from "./useUserContext";

const useFetchBillings = (paging) => {
  const { user } = useUserContext();
  const { auth } = useAuthContext();
  const [billings, setBillings] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [rangeStart, setRangeStart] = useState(
    Date.parse(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  ); //start of the month
  const [rangeEnd, setRangeEnd] = useState(
    Date.parse(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  ); //end of the month
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setBillings([]);
  }, [rangeStart, rangeEnd]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchBillings = async () => {
      try {
        setLoading(true);
        let response;
        if (user.title !== "Secretary") {
          //billings concerning the user in range
          response = await axiosXanoStaff.get(`/billings_for_staff_in_range`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            params: {
              range_start: rangeStart,
              range_end: rangeEnd,
              staff_id: user.id,
              paging,
            },
            signal: abortController.signal,
          });
        } else {
          //all billings
          response = await axiosXanoStaff.get(`/billings_in_range`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            params: {
              range_start: rangeStart,
              range_end: rangeEnd,
              paging,
            },
            signal: abortController.signal,
          });
        }
        if (abortController.signal.aborted) return;
        setBillings((prevDatas) => [...prevDatas, ...response.data.items]);
        setHasMore(response.data.items.length > 0);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.name !== "CanceledError") {
          setErrMsg(`Unable to fetch billings: ${err.message}`);
        }
      }
    };
    fetchBillings();
    return () => abortController.abort();
  }, [auth.authToken, rangeEnd, rangeStart, user.id, user.title, paging]);

  return {
    billings,
    setBillings,
    rangeStart,
    setRangeStart,
    rangeEnd,
    setRangeEnd,
    hasMore,
    loading,
    errMsg,
  };
};

export default useFetchBillings;
