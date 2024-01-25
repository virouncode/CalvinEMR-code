// import "flatpickr/dist/themes/material_blue.css";
import React from "react";
import Flatpickr from "react-flatpickr";

const Shortcutpickr = ({ handleShortcutpickrChange }) => {
  return (
    <div className="calendar__shortcutpickr">
      <Flatpickr
        options={{
          inline: true,
          dateFormat: "Z",
          shorthandCurrentMonth: true,
        }}
        onChange={handleShortcutpickrChange}
      />
    </div>
  );
};

export default Shortcutpickr;
