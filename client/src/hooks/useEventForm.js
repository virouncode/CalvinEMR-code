import { useCallback, useEffect, useReducer } from "react";

import xanoGet from "../api/xanoCRUD/xanoGet";

const initialState = {
  formDatas: null,
  tempFormDatas: null,
  isLoading: false,
  errMsg: null,
};

const httpReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        isLoading: state.formDatas ? false : true,
        errMsg: null,
      };
    case "FETCH_ERROR":
      return {
        formDatas: null,
        tempFormDatas: null,
        isLoading: false,
        errMsg: action.payload,
      };
    case "FETCH_SUCCESS":
      return {
        formDatas: action.payload,
        tempFormDatas: action.payload,
        isLoading: false,
        errMsg: null,
      };
    case "SET_TEMPFORMDATAS":
      return { ...state, tempFormDatas: action.payload };
    default:
      return initialState;
  }
};

export const useEventForm = (eventId) => {
  const [httpState, dispatch] = useReducer(httpReducer, initialState);
  const fetchEventFormDatas = useCallback(
    async (abortController) => {
      try {
        dispatch({ type: "FETCH_START" });
        const response = await xanoGet(
          `/appointments/${eventId}`,
          "staff",
          null,
          abortController
        );
        if (abortController.signal.aborted) return;
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (err) {
        if (err.name !== "CanceledError") {
          dispatch({
            type: "FETCH_ERROR",
            payload: `Error: unable to fetch event datas: ${err.message}`,
          });
        }
      }
    },
    [eventId]
  );

  const setTempFormDatas = (newTempFormDatas) => {
    dispatch({ type: "SET_TEMPFORMDATAS", payload: newTempFormDatas });
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchEventFormDatas(abortController);
    return () => {
      abortController.abort();
    };
  }, [fetchEventFormDatas]);

  return [httpState, fetchEventFormDatas, setTempFormDatas];
};
