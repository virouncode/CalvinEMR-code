import { useEffect } from "react";
import xanoGet from "../api/xanoCRUD/xanoGet";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";

const useFetchCategoryDatas = (
  url,
  setTopicDatas,
  setLoading,
  setErrMsg,
  paging,
  setHasMore,
  patientId
) => {
  const { auth } = useAuthContext();

  useEffect(() => {
    if (paging.page === 1) return;
    const abortController = new AbortController();
    const fetchCategoryDatas = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const response = await xanoGet(
          url,
          axiosXanoStaff,
          auth.authToken,
          {
            patient_id: patientId,
            paging,
          },
          abortController
        );
        if (abortController.signal.aborted) return;
        setTopicDatas((prevDatas) => [...prevDatas, ...response.data.items]);
        setHasMore(response.data.items.length > 0);
        setLoading(false);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setErrMsg(err.message);
        }
        setLoading(false);
      }
    };
    fetchCategoryDatas();
    return () => {
      abortController.abort();
    };
  }, [
    auth.authToken,
    paging,
    patientId,
    setErrMsg,
    setHasMore,
    setLoading,
    setTopicDatas,
    url,
  ]);
};

export default useFetchCategoryDatas;
