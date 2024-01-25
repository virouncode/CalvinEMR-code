import { useCallback, useEffect, useReducer } from "react";
import { axiosXanoStaff } from "../api/xanoStaff";
import { sortByDate } from "../utils/socketHandlers/updates";
import useAuth from "./useAuth";

const initialHttpState = {
  datas: null,
  isLoading: false,
  errMsg: null,
};

const httpReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: state.datas ? false : true, errMsg: null };
    case "FETCH_ERROR":
      return {
        ...state,
        datas: null,
        isLoading: false,
        errMsg: action.payload,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        datas: action.payload,
        isLoading: false,
        errMsg: null,
      };
    case "SET_DATAS":
      return { ...state, datas: action.payload };
    default:
      return initialHttpState;
  }
};

export const useClinicalNotes = (url, patientId, order) => {
  const { auth } = useAuth();
  const [httpState, dispatch] = useReducer(httpReducer, initialHttpState);
  const fetchRecord = useCallback(
    async (abortController, order) => {
      if (!url || abortController.signal.aborted) {
        return;
      }
      try {
        dispatch({ type: "FETCH_START" });
        const response = await axiosXanoStaff.get(
          `${url}?patient_id=${patientId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        dispatch({
          type: "FETCH_SUCCESS",
          payload:
            order === "top"
              ? sortByDate(response.data, false)
              : sortByDate(response.date, true),
        });
      } catch (err) {
        if (err.name !== "CanceledError") {
          dispatch({
            type: "FETCH_ERROR",
            payload: `Error: unable to fetch patient record: ${err.message}`,
          });
        }
      }
    },
    [auth.authToken, patientId, url]
  );

  const setDatas = (newDatas) => {
    dispatch({ type: "SET_DATAS", payload: newDatas });
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchRecord(abortController, order);
    return () => {
      abortController.abort();
    };
  }, [fetchRecord, order]);
  return [httpState, fetchRecord, setDatas];
};
