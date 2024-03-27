import { useEffect, useState } from "react";
import xanoGet from "../api/xanoCRUD/xanoGet";

const useFetchEdocs = () => {
  const [search, setSearch] = useState("");
  const [edocs, setEdocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [paging, setPaging] = useState({ page: 1, perPage: 10, offset: 0 });
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setEdocs([]);
  }, [search]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchEdocs = async () => {
      try {
        setLoading(true);
        const response = await xanoGet("/edocs_search", "staff", {
          search,
          paging,
        });
        if (abortController.signal.aborted) return;
        setEdocs((prevDatas) => [...prevDatas, ...response.data.items]);
        setHasMore(response.data.items.length > 0);
        setLoading(false);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setErrMsg(`Error: unable to get edocs: ${err.message}`);
        }
        setLoading(false);
      }
    };
    fetchEdocs();
    return () => abortController.abort();
  }, [search, paging]);

  return {
    search,
    setSearch,
    edocs,
    setEdocs,
    paging,
    setPaging,
    hasMore,
    loading,
    errMsg,
  };
};

export default useFetchEdocs;
