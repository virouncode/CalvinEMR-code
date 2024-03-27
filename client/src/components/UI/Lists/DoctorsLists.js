import React from "react";

const DoctorsList = ({
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
        Choose a doctor...
      </option>
      <option value="0">None</option>
      {staffInfos
        .filter(({ title }) => title === "Doctor")
        .map((doctor) => (
          <option value={doctor.id} key={doctor.id}>
            Dr. {doctor.full_name}
          </option>
        ))}
    </select>
  );
};

export default DoctorsList;
