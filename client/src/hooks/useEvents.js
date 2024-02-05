import { useCallback, useEffect, useReducer } from "react";
import { axiosXanoStaff } from "../api/xanoStaff";
import { parseToEvents } from "../utils/parseToEvents";
import useAuth from "./useAuth";

const initialState = {
  events: null,
  remainingStaff: [],
  isLoading: false,
  errMsg: null,
};

const httpReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: state.events ? false : true, errMsg: null };
    case "FETCH_ERROR":
      return {
        events: null,
        remainingStaff: [],
        isLoading: false,
        errMsg: action.payload,
      };
    case "FETCH_SUCCESS":
      return {
        events: action.payload[0],
        remainingStaff: action.payload[1],
        isLoading: false,
        errMsg: null,
      };
    case "SET_EVENTS":
      return { ...state, events: action.payload };
    default:
      return initialState;
  }
};

export const useEvents = (
  hostsIds,
  rangeStart,
  rangeEnd,
  timelineVisible,
  timelineSiteId,
  sitesIds,
  sites,
  isSecretary,
  userId
) => {
  const { auth, clinic } = useAuth();
  const [httpState, dispatch] = useReducer(httpReducer, initialState);
  const fetchEvents = useCallback(
    async (abortController) => {
      try {
        dispatch({ type: "FETCH_START" });
        const response = await axiosXanoStaff.post(
          "/appointments_for_staff_and_sites",
          {
            hosts_ids: hostsIds,
            range_start: rangeStart,
            range_end: rangeEnd,
            sites_ids: timelineVisible ? [timelineSiteId] : sitesIds,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        const formattedEvents = parseToEvents(
          response.data,
          clinic.staffInfos,
          sites,
          isSecretary,
          userId
        );
        if (abortController.signal.aborted) return;
        dispatch({ type: "FETCH_SUCCESS", payload: formattedEvents });
      } catch (err) {
        if (err.name !== "CanceledError") {
          dispatch({
            type: "FETCH_ERROR",
            payload: `Error: unable to fetch appointments: ${err.message}`,
          });
        }
      }
    },
    [
      auth.authToken,
      clinic.staffInfos,
      hostsIds,
      isSecretary,
      rangeEnd,
      rangeStart,
      sites,
      sitesIds,
      timelineSiteId,
      timelineVisible,
      userId,
    ]
  );

  const setEvents = (newEvents) => {
    dispatch({ type: "SET_EVENTS", payload: newEvents });
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchEvents(abortController);
    return () => {
      abortController.abort();
    };
  }, [fetchEvents]);

  return [httpState, fetchEvents, setEvents];
};
