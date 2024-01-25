import React from "react";
import FilterCheckboxes from "./FilterCheckboxes";

const CalendarFilter = ({
  staffInfos,
  hostsIds,
  setHostsIds,
  remainingStaff,
}) => {
  return (
    <div className="calendar__filter">
      <p className="calendar__filter-title">Show Calendars</p>
      <FilterCheckboxes
        staffInfos={staffInfos}
        hostsIds={hostsIds}
        setHostsIds={setHostsIds}
        remainingStaff={remainingStaff}
      />
    </div>
  );
};

export default CalendarFilter;
