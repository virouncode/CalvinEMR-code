import React from "react";
import FilterCheckboxes from "./FilterCheckboxes";
import SitesCheckboxes from "./SitesCheckboxes";

const CalendarFilter = ({
  sites,
  sitesIds,
  setSitesIds,
  hostsIds,
  setHostsIds,
  remainingStaff,
}) => {
  return (
    <div className="calendar__filter">
      <p className="calendar__filter-title">Show Calendars</p>
      <SitesCheckboxes
        sites={sites}
        sitesIds={sitesIds}
        setSitesIds={setSitesIds}
      />
      <FilterCheckboxes
        hostsIds={hostsIds}
        setHostsIds={setHostsIds}
        remainingStaff={remainingStaff}
      />
    </div>
  );
};

export default CalendarFilter;
