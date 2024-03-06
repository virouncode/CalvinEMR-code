import { useCallback, useEffect, useReducer } from "react";
import xanoGet from "../api/xanoCRUD/xanoGet";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";

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
      return { datas: null, isLoading: false, errMsg: action.payload };
    case "FETCH_SUCCESS":
      return { datas: action.payload, isLoading: false, errMsg: null };
    case "SET_DATAS":
      return { ...state, datas: action.payload };
    default:
      return initialHttpState;
  }
};

export const usePatientRecord = (url, patientId) => {
  const { auth } = useAuthContext();
  const [httpState, dispatch] = useReducer(httpReducer, initialHttpState);
  const fetchRecord = useCallback(
    async (abortController) => {
      if (!url || abortController.signal.aborted) {
        return;
      }
      try {
        dispatch({ type: "FETCH_START" });
        const response = await xanoGet(
          url,
          axiosXanoStaff,
          auth.authToken,
          { patient_id: patientId },
          abortController
        );
        if (abortController.signal.aborted) return;
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
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
    fetchRecord(abortController);
    return () => {
      abortController.abort();
    };
  }, [fetchRecord]);
  return [httpState, fetchRecord, setDatas];
};
