import { useEffect, useState } from "react";

import xanoGet from "../api/xanoCRUD/xanoGet";
import { getEndOfTheMonthTZ, getStartOfTheMonthTZ } from "../utils/formatDates";
import useUserContext from "./useUserContext";

const useFetchBillings = (paging, userType) => {
  const { user } = useUserContext();
  const [billings, setBillings] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [rangeStart, setRangeStart] = useState(getStartOfTheMonthTZ()); //start of the month
  const [rangeEnd, setRangeEnd] = useState(getEndOfTheMonthTZ()); //end of the month
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
        if (user.title !== "Secretary" && user.access_level !== "Admin") {
          //billings concerning the user in range
          response = await xanoGet(
            "/billings_of_staff_in_range",
            userType,
            {
              range_start: rangeStart,
              range_end: rangeEnd,
              staff_id: user.id,
              paging,
            },
            abortController
          );
        } else {
          //all billings
          response = await xanoGet(
            "/billings_in_range",
            userType,
            {
              range_start: rangeStart,
              range_end: rangeEnd,
              paging,
            },
            abortController
          );
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
  }, [
    paging,
    rangeEnd,
    rangeStart,
    user.access_level,
    user.id,
    user.title,
    userType,
  ]);

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
