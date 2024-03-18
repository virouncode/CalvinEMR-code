import { useCallback, useEffect, useState } from "react";

import xanoGet from "../api/xanoCRUD/xanoGet";

export const useEventForm = (eventId) => {
  const [formDatas, setFormDatas] = useState(null);
  const [tempFormDatas, setTempFormDatas] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [previousStart, setPreviousStart] = useState(null);
  const [previousEnd, setPreviousEnd] = useState(null);

  const fetchEventFormDatas = useCallback(
    async (abortController) => {
      try {
        setLoadingEvent(true);
        const response = await xanoGet(
          `/appointments/${eventId}`,
          "staff",
          null,
          abortController
        );
        if (abortController.signal.aborted) return;
        setLoadingEvent(false);
        setFormDatas(response.data);
        setTempFormDatas(response.data);
        setPreviousStart(response.data.start);
        setPreviousEnd(response.data.end);
      } catch (err) {
        setLoadingEvent(false);
        if (err.name !== "CanceledError") {
          setErrMsg(`Error: unable to fetch event datas: ${err.message}`);
        }
      }
    },
    [eventId]
  );

  useEffect(() => {
    const abortController = new AbortController();
    fetchEventFormDatas(abortController);
    return () => {
      abortController.abort();
    };
  }, [fetchEventFormDatas]);

  return {
    formDatas,
    setFormDatas,
    tempFormDatas,
    setTempFormDatas,
    previousStart,
    setPreviousStart,
    previousEnd,
    setPreviousEnd,
    loadingEvent,
    setLoadingEvent,
    errMsg,
    setErrMsg,
  };
};
