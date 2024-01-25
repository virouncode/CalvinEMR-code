import React from "react";
import formatName from "../../../../utils/formatName";

const StudentsList = ({
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
        Choose a student...
      </option>
      <option value="0">None</option>
      {staffInfos
        .filter(({ title }) => title === "Student")
        .map((student) => (
          <option value={student.id} key={student.id}>
            {formatName(student.full_name)}
          </option>
        ))}
    </select>
  );
};

export default StudentsList;
