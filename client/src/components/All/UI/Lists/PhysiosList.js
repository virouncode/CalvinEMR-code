import React from "react";
import formatName from "../../../../utils/formatName";

const PhysiosList = ({
  value,
  name,
  handleChange,
  style,
  onFocus,
  onBlur,
  staffInfos,
}) => {
  return (
    <select
      value={value}
      name={name}
      style={style}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={handleChange}
    >
      <option value="" disabled>
        Choose a physiotherapist...
      </option>
      <option value="0">None</option>
      {staffInfos
        .filter(({ title }) => title === "Physiotherapist")
        .map((physio) => (
          <option value={physio.id} key={physio.id}>
            {formatName(physio.full_name)}
          </option>
        ))}
    </select>
  );
};

export default PhysiosList;
