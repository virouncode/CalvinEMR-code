// import "flatpickr/dist/themes/material_blue.css";
import React from "react";
import Flatpickr from "react-flatpickr";

const FlatpickrEnd = ({ fpEnd, start, endTime, allDay, handleEndChange }) => {
  return (
    <>
      <label>End</label>
      <Flatpickr
        ref={fpEnd}
        options={{
          enableTime: true,
          altInput: true,
          altFormat: "M j, Y, h:i K",
          dateFormat: "Z",
          minDate: start,
          shorthandCurrentMonth: true,
        }}
        name="End_Time"
        value={endTime}
        onChange={handleEndChange}
        onOpen={() => {
          if (allDay) {
            fpEnd.current.flatpickr.close();
            return;
          }
        }}
      />
    </>
  );
};

export default FlatpickrEnd;
