// import "flatpickr/dist/themes/material_blue.css";
import React from "react";
import Flatpickr from "react-flatpickr";

const FlatpickrStart = ({ fpStart, startTime, handleStartChange, allDay }) => {
  return (
    <>
      <label>Start</label>
      <Flatpickr
        ref={fpStart}
        options={{
          enableTime: true,
          altInput: true,
          altFormat: "M j, Y, h:i K",
          dateFormat: "Z",
          shorthandCurrentMonth: true,
        }}
        name="start"
        value={startTime}
        onChange={handleStartChange}
        onOpen={() => {
          if (allDay) {
            fpStart.current.flatpickr.close();
            return;
          }
        }}
      />
    </>
  );
};

export default FlatpickrStart;
