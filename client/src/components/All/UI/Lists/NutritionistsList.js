import React from "react";
import formatName from "../../../../utils/formatName";

const NutritionistsList = ({
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
        Choose a nutritionist...
      </option>
      <option value="0">None</option>
      {staffInfos
        .filter(({ title }) => title === "Nutritionist")
        .map((nutri) => (
          <option value={nutri.id} key={nutri.id}>
            {formatName(nutri.full_name)}
          </option>
        ))}
    </select>
  );
};

export default NutritionistsList;
