import { useEffect, useState } from "react";

const useFetchDatas = (
  url,
  axiosXanoInstance,
  authToken,
  queryParam = null,
  queryValue = null,
  singleResult = false
) => {
  const [datas, setDatas] = useState(singleResult ? {} : []);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const finalURL = queryParam ? `${url}?${queryParam}=${queryValue}` : url;

  useEffect(() => {
    if (!url) return;
    const abortController = new AbortController();
    const fetchDatas = async () => {
      try {
        setLoading(true);
        const response = await axiosXanoInstance.get(finalURL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        setLoading(false);
        setDatas(response.data);
        console.log(response.data);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setErr(`Error: unable to get datas: ${err.message}`);
        }
        setLoading(false);
      }
    };
    fetchDatas();
    return () => abortController.abort();
  }, [authToken, axiosXanoInstance, finalURL, url]);

  return [datas, setDatas, loading, err];
};

export default useFetchDatas;
