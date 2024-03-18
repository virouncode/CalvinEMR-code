import React from "react";
import { nowTZ } from "../../../utils/formatDates";

const WeekPicker = ({ handleClickNext, handleClickPrevious, rangeStart }) => {
  return (
    <div className="new-appointments__content-weekpicker">
      <button
        onClick={handleClickPrevious}
        disabled={
          rangeStart === nowTZ().plus({ days: 1 }).startOf("day").toMillis()
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
