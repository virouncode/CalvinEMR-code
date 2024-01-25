import React from "react";
import formatName from "../../../../utils/formatName";

const NursesList = ({
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
        Choose a nurse...
      </option>
      <option value="0">None</option>
      {staffInfos
        .filter(({ title }) => title === "Nurse")
        .map((nurse) => (
          <option value={nurse.id} key={nurse.id}>
            {formatName(nurse.full_name)}
          </option>
        ))}
    </select>
  );
};

export default NursesList;
