import { useEffect, useState } from "react";

import xanoGet from "../api/xanoCRUD/xanoGet";

const useFetchTodos = (paging, search, staffId) => {
  const [todos, setTodos] = useState([]);
  const [hasMoreTodos, setHasMoreTodos] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [errMsgTodos, setErrMsgTodos] = useState("");
  useEffect(() => {
    setTodos([]);
  }, [search]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchTodos = async () => {
      try {
        setLoadingTodos(true);
        setErrMsgTodos("");
        const response = await xanoGet(
          "/todos_of_staff",
          "staff",
          {
            staff_id: staffId,
            search,
            paging,
          },
          abortController
        );
        if (abortController.signal.aborted) return;
        setTodos((prevDatas) => [...prevDatas, ...response.data.items]);
        setHasMoreTodos(response.data.items.length > 0);
        setLoadingTodos(false);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.log(err);
          setErrMsgTodos(err.message);
        }
        setLoadingTodos(false);
      }
    };
    fetchTodos();
    return () => {
      abortController.abort();
    };
  }, [paging, search, staffId]);

  return {
    todos,
    setTodos,
    loadingTodos,
    errMsgTodos,
    hasMoreTodos,
  };
};

export default useFetchTodos;
