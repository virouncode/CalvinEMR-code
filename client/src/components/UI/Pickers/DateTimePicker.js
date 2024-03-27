import React from "react";
import {
  timestampToAMPMStrTZ,
  timestampToDateISOTZ,
  timestampToHoursStrTZ,
  timestampToMinutesStrTZ,
} from "../../../utils/dates/formatDates";

export const DateTimePicker = ({
  value,
  timezone,
  locale,
  readOnlyTime,
  readOnlyDate,
  handleChange,
  refDate,
  refHours,
  refMinutes,
  refAMPM,
  label = "",
}) => {
  //value is an appointment date
  return (
    <div className="datetimepicker">
      {label && <div className="datetimepicker__label">{label}</div>}
      <div className="datetimepicker__date">
        <input
          type="date"
          value={timestampToDateISOTZ(value, timezone)}
          onChange={handleChange}
          disabled={readOnlyDate}
          name="date"
          ref={refDate}
        />
      </div>
      <div className="datetimepicker__time">
        <select
          className="datetimepicker__hours"
          onChange={handleChange}
          value={timestampToHoursStrTZ(value, timezone, locale)}
          disabled={readOnlyTime}
          style={{ width: "40px", marginLeft: "3px" }}
          name="hours"
          ref={refHours}
        >
          <option value="01">01</option>
          <option value="02">02</option>
          <option value="03">03</option>
          <option value="04">04</option>
          <option value="05">05</option>
          <option value="06">06</option>
          <option value="07">07</option>
          <option value="08">08</option>
          <option value="09">09</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
        <select
          className="datetimepicker__minutes"
          onChange={handleChange}
          value={timestampToMinutesStrTZ(value, timezone, locale)}
          disabled={readOnlyTime}
          style={{ width: "40px", marginLeft: "3px" }}
          name="minutes"
          ref={refMinutes}
        >
          <option value="00">00</option>
          <option value="05">05</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="25">25</option>
          <option value="30">30</option>
          <option value="35">35</option>
          <option value="40">40</option>
          <option value="45">45</option>
          <option value="50">50</option>
          <option value="55">55</option>
        </select>
        <select
          className="datetimepicker__ampm"
          onChange={handleChange}
          value={timestampToAMPMStrTZ(value, timezone, locale)}
          disabled={readOnlyTime}
          style={{ width: "45px", marginLeft: "3px" }}
          name="ampm"
          ref={refAMPM}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

export default DateTimePicker;
