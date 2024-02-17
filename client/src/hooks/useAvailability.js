import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../api/xanoStaff";

const useAvailabilty = (userId, authToken) => {
  const [scheduleMorning, setScheduleMorning] = useState(null);
  const [scheduleAfternoon, setScheduleAfternoon] = useState(null);
  const [unavailability, setUnavailability] = useState(null);
  const [availabilityId, setAvailabilityId] = useState(0);
  const [defaultDurationHours, setDefaultDurationHours] = useState(1);
  const [defaultDurationMin, setDefaultDurationMin] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAvailability = async () => {
      try {
        const response = await axiosXanoStaff.get(
          `/availability_for_staff?staff_id=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setScheduleMorning(response.data.schedule_morning);
        setScheduleAfternoon(response.data.schedule_afternoon);
        setUnavailability(response.data.unavailability);
        setAvailabilityId(response.data.id);
        setDefaultDurationHours(response.data.default_duration_hours);
        setDefaultDurationMin(response.data.default_duration_min);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(
            `Error : unable to fetch your availability: ${err.message}`,
            {
              containerId: "A",
            }
          );
      }
    };
    fetchAvailability();
    return () => abortController.abort();
  }, [authToken, userId]);
  return {
    scheduleMorning,
    setScheduleMorning,
    scheduleAfternoon,
    setScheduleAfternoon,
    unavailability,
    setUnavailability,
    availabilityId,
    setAvailabilityId,
    defaultDurationHours,
    setDefaultDurationHours,
    defaultDurationMin,
    setDefaultDurationMin,
  };
};

export default useAvailabilty;
