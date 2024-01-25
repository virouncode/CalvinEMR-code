import React from "react";
import formatName from "../../../../utils/formatName";

const USTechsList = ({
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
        Choose an ultrasound tech...
      </option>
      <option value="0">None</option>
      {staffInfos
        .filter(({ title }) => title === "Ultra Sound Technician")
        .map((tech) => (
          <option value={tech.id} key={tech.id}>
            {formatName(tech.full_name)}
          </option>
        ))}
    </select>
  );
};

export default USTechsList;
