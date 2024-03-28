import React from "react";
import StatusOption from "./StatusOption";

const StatusSelect = ({
  handleChange,
  selectedStatus,
  statuses,
  label = true,
}) => {
  return (
    <>
      {label && <label>Status</label>}
      <select
        name="AppointmentStatus"
        onChange={handleChange}
        value={selectedStatus}
      >
        {statuses.map((status) => (
          <StatusOption key={status} status={status} />
        ))}
      </select>
    </>
  );
};

export default StatusSelect;
