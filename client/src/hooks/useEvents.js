import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import xanoGet from "../api/xanoCRUD/xanoGet";
import { parseToEvents } from "../utils/parseToEvents";
import useUserContext from "./useUserContext";

const useEvents = (
  hostsIds,
  rangeStart,
  rangeEnd,
  timelineVisible,
  timelineSiteId,
  sitesIds,
  sites,
  staffInfos
) => {
  const { user } = useUserContext();
  const [events, setEvents] = useState([]);
  const [remainingStaff, setRemainingStaff] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchEvents = async () => {
      try {
        const response = await xanoGet(
          "/appointments_of_staff_and_sites",
          "staff",
          {
            hosts_ids: hostsIds,
            range_start: rangeStart,
            range_end: rangeEnd,
            sites_ids: timelineVisible ? [timelineSiteId] : sitesIds,
          }
        );
        const formattedEvents = parseToEvents(
          response.data,
          staffInfos,
          sites,
          user.title === "Secretary",
          user.id
        );
        if (abortController.signal.aborted) return;
        setEvents(formattedEvents[0]);
        setRemainingStaff(formattedEvents[1]);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.log(err);
          toast.error(`Error: unable to get events: ${err.message}`, {
            containerId: "A",
          });
        }
      }
    };
    fetchEvents(abortController);
    return () => {
      abortController.abort();
    };
  }, [
    hostsIds,
    rangeEnd,
    rangeStart,
    sites,
    sitesIds,
    staffInfos,
    timelineSiteId,
    timelineVisible,
    user.id,
    user.title,
  ]);

  return [events, setEvents, remainingStaff];
};
export default useEvents;
