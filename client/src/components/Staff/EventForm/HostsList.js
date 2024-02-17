import React from "react";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import HostOption from "./HostOption";

const HostsList = ({ handleHostChange, hostId, disabled = false, style }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <select
      name="host_id"
      onChange={handleHostChange}
      value={hostId}
      disabled={disabled}
      style={style}
    >
      <option value="0" disabled>
        Choose a host...
      </option>
      {staffInfos
        .sort((a, b) => a.last_name.localeCompare(b.last_name))
        .map((staff) => (
          <HostOption staff={staff} key={staff.id} />
        ))}
    </select>
  );
};

export default HostsList;
