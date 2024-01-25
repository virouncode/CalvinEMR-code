import React from "react";
import formatName from "../../../../utils/formatName";

const PsychosList = ({
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
        Choose a psychologist...
      </option>
      <option value="0">None</option>
      {staffInfos
        .filter(({ title }) => title === "Psychologist")
        .map((psycho) => (
          <option value={psycho.id} key={psycho.id}>
            {formatName(psycho.full_name)}
          </option>
        ))}
    </select>
  );
};

export default PsychosList;
