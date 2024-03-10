import { useCallback, useEffect, useState } from "react";
import xanoGet from "../api/xanoCRUD/xanoGet";

const useFetchDashboard = () => {
  const [visits, setVisits] = useState();
  const [rangeStartVisits, setRangeStartVisits] = useState(
    Date.parse(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  );
  const [rangeEndVisits, setRangeEndVisits] = useState(
    Date.parse(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  );
  const [errVisits, setErrVisits] = useState("");
  const [loadingVisits, setLoadingVisits] = useState("");

  const [billings, setBillings] = useState();
  const [rangeStartBillings, setRangeStartBillings] = useState(
    Date.parse(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  );
  const [rangeEndBillings, setRangeEndBillings] = useState(
    Date.parse(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  );
  const [errBillings, setErrBillings] = useState("");
  const [loadingBillings, setLoadingBillings] = useState("");

  // const [medications, setMedications] = useState();
  // const [rangeStartMedications, setRangeStartMedications] = useState(
  //   Date.parse(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  // );
  // const [rangeEndMedications, setRangeEndMedications] = useState(
  //   Date.parse(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  // );
  // const [errMedications, setErrMedications] = useState("");
  // const [loadingMedications, setLoadingMedications] = useState("");

  const fetchDatas = useCallback(
    async (
      rangeStart,
      rangeEnd,
      setDatas,
      setLoading,
      setErr,
      endpoint,
      abortController
    ) => {
      try {
        setLoading(true);
        const response = await xanoGet(
          `/dashboard/${endpoint}`,
          "admin",
          {
            range_start: rangeStart,
            range_end: rangeEnd,
          },
          abortController
        );
        if (abortController.signal.aborted) return;
        setDatas(response.data);
        setLoading(false);
      } catch (err) {
        setErr(`Unable to fetch datas: ${err.message}`);
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const abortController = new AbortController();
    const fetchDashboard = async () => {
      await fetchDatas(
        rangeStartVisits,
        rangeEndVisits,
        setVisits,
        setLoadingVisits,
        setErrVisits,
        "visits_in_range",
        abortController
      );
      await fetchDatas(
        rangeStartBillings,
        rangeEndBillings,
        setBillings,
        setLoadingBillings,
        setErrBillings,
        "billings_in_range",
        abortController
      );
      // await fetchDatas(
      //   rangeStartMedications,
      //   rangeEndMedications,
      //   setMedications,
      //   setLoadingMedications,
      //   setErrMedications,
      //   "medications_in_range",
      //   abortController
      // );
    };
    fetchDashboard();
    return () => abortController.abort();
  }, [
    fetchDatas,
    rangeEndBillings,
    // rangeEndMedications,
    rangeEndVisits,
    rangeStartBillings,
    // rangeStartMedications,
    rangeStartVisits,
  ]);

  return {
    visits,
    setVisits,
    rangeStartVisits,
    setRangeStartVisits,
    rangeEndVisits,
    setRangeEndVisits,
    loadingVisits,
    setLoadingVisits,
    errVisits,
    setErrVisits,
    billings,
    setBillings,
    rangeStartBillings,
    setRangeStartBillings,
    rangeEndBillings,
    setRangeEndBillings,
    loadingBillings,
    setLoadingBillings,
    errBillings,
    setErrBillings,
  };
};

export default useFetchDashboard;
