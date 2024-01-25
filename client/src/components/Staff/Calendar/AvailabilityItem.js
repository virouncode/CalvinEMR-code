import React from "react";
import { firstLetterUpper } from "../../../utils/firstLetterUpper";
import TimePickerAvailability from "../../All/UI/Pickers/TimePickerAvailability";

const AvailabilityItem = ({
  day,
  handleStartMorningChange,
  handleEndMorningChange,
  handleStartAfternoonChange,
  handleEndAfternoonChange,
  handleCheck,
  scheduleMorning,
  scheduleAfternoon,
  unavailable,
}) => {
  return (
    <div className="availability__row">
      <div className="availability__column--day">{firstLetterUpper(day)}</div>
      <div className="availability__column--time">
        <TimePickerAvailability
          day={day}
          handleChange={handleStartMorningChange}
          readOnly={unavailable}
          timeValueHour={scheduleMorning[0].hours}
          timeValueMin={scheduleMorning[0].min}
          timeValueAMPM={scheduleMorning[0].ampm}
        />
        <p>To</p>
        <TimePickerAvailability
          day={day}
          handleChange={handleEndMorningChange}
          readOnly={unavailable}
          timeValueHour={scheduleMorning[1].hours}
          timeValueMin={scheduleMorning[1].min}
          timeValueAMPM={scheduleMorning[1].ampm}
        />
      </div>
      <div className="availability__column--time">
        <TimePickerAvailability
          day={day}
          handleChange={handleStartAfternoonChange}
          readOnly={unavailable}
          timeValueHour={scheduleAfternoon[0].hours}
          timeValueMin={scheduleAfternoon[0].min}
          timeValueAMPM={scheduleAfternoon[0].ampm}
        />
        <p>To</p>
        <TimePickerAvailability
          day={day}
          handleChange={handleEndAfternoonChange}
          readOnly={unavailable}
          timeValueHour={scheduleAfternoon[1].hours}
          timeValueMin={scheduleAfternoon[1].min}
          timeValueAMPM={scheduleAfternoon[1].ampm}
        />
      </div>
      <div className="availability__column--checkbox">
        <input
          type="checkbox"
          id="notavailable"
          onChange={(e) => handleCheck(e, day)}
          checked={unavailable}
        />
        <label htmlFor="notavailable">Not available</label>
      </div>
    </div>
  );
};

export default AvailabilityItem;
