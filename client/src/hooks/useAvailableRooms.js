import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAvailableRooms } from "../api/getAvailableRooms";

const useAvailableRooms = (
  appointmentId,
  rangeStart,
  rangeEnd,
  sites,
  siteId
) => {
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAvailableRooms = async () => {
      try {
        const response = await getAvailableRooms(
          parseInt(appointmentId),
          rangeStart,
          rangeEnd,
          sites,
          siteId,
          abortController
        );
        if (abortController.signal.aborted) return;
        setAvailableRooms(response);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to get available rooms ${err.message}`, {
            containerId: "A",
          });
      }
    };
    fetchAvailableRooms();
    return () => {
      abortController.abort();
    };
  }, [appointmentId, rangeEnd, rangeStart, siteId, sites]);

  return [availableRooms, setAvailableRooms];
};

export default useAvailableRooms;
