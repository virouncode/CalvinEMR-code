import React from "react";
import StatusRadioItem from "./StatusRadioItem";

const StatusesRadio = ({
  handleStatusChange,
  selectedStatus,
  statuses,
  label = true,
}) => {
  const isStatusSelected = (status) => selectedStatus === status;
  return (
    <>
      {label && <p>Status</p>}
      <div className="event-form__radio-container">
        {statuses.map((status) => (
          <StatusRadioItem
            key={status}
            status={status}
            handleStatusChange={handleStatusChange}
            isStatusSelected={isStatusSelected}
          />
        ))}
      </div>
    </>
  );
};

export default StatusesRadio;
