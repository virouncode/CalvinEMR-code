import React from "react";
import Availability from "./Availability";
import FirstDaySelect from "./FirstDaySelect";
import SlotSelect from "./SlotSelect";

const CalendarOptions = ({
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
}) => {
  return (
    <div className="calendar__options">
      <SlotSelect />
      <FirstDaySelect />
      <Availability
        scheduleMorning={scheduleMorning}
        setScheduleMorning={setScheduleMorning}
        scheduleAfternoon={scheduleAfternoon}
        setScheduleAfternoon={setScheduleAfternoon}
        unavailability={unavailability}
        setUnavailability={setUnavailability}
        availabilityId={availabilityId}
        setAvailabilityId={setAvailabilityId}
        defaultDurationHours={defaultDurationHours}
        setDefaultDurationHours={setDefaultDurationHours}
        defaultDurationMin={defaultDurationMin}
        setDefaultDurationMin={setDefaultDurationMin}
      />
    </div>
  );
};

export default CalendarOptions;
