import React from "react";

const ToggleView = ({ timelineVisible, setTimelineVisible }) => {
  const handleClickCalendar = (e) => {
    setTimelineVisible(false);
  };
  const handleClickRooms = (e) => {
    setTimelineVisible(true);
  };
  return (
    <div className="calendar-section__toggle-view">
      <p
        className={
          timelineVisible
            ? "calendar-section__option"
            : "calendar-section__option calendar-section__option--active"
        }
        onClick={handleClickCalendar}
      >
        Calendar
      </p>
      <p
        className={
          timelineVisible
            ? "calendar-section__option calendar-section__option--active"
            : "calendar-section__option"
        }
        onClick={handleClickRooms}
      >
        Rooms
      </p>
    </div>
  );
};

export default ToggleView;
