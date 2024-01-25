import React from "react";
import Availability from "./Availability";
import FirstDaySelect from "./FirstDaySelect";
import SlotSelect from "./SlotSelect";

const CalendarOptions = ({ title }) => {
  return (
    <div className="calendar__options">
      <p className="calendar__options-title">{title}</p>
      <SlotSelect />
      <FirstDaySelect />
      <Availability />
    </div>
  );
};

export default CalendarOptions;
