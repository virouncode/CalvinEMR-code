import React from "react";
import { getWeekRange } from "../../../utils/formatDates";

const WeekPicker = ({
  handleClickNext,
  handleClickPrevious,
  rangeStart,
  rangeEnd,
}) => {
  return (
    <div className="new-appointments__content-weekpicker">
      <button
        onClick={handleClickPrevious}
        disabled={
          rangeStart === Date.parse(getWeekRange(new Date().getDay())[0])
        }
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>
      <label>Change week</label>
      <button onClick={handleClickNext}>
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default WeekPicker;
