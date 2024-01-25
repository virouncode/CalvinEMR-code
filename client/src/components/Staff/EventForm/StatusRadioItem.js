import React from "react";

const StatusRadioItem = ({ status, handleStatusChange, isStatusSelected }) => {
  return (
    <div className="event-form__item event-form__item--radio">
      <input
        type="radio"
        name="AppointmentStatus"
        id={status}
        value={status}
        onChange={handleStatusChange}
        checked={isStatusSelected(status)}
      />
      <label htmlFor={status}>{status}</label>
    </div>
  );
};

export default StatusRadioItem;
