import React from "react";

const PregnanciesList = ({
  value,
  name,
  style,
  handleChange,
  onFocus,
  onBlur,
}) => {
  return (
    <select
      className="form-select"
      name={name}
      onChange={handleChange}
      value={value}
      style={style}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <option value="" disabled>
        Choose an event
      </option>
      <option value="Abortion - 1st trimester">Abortion - 1st trimester</option>
      <option value="Abortion - 2nd trimester">Abortion - 2nd trimester</option>
      <option value="Abortion - 3rd trimester">Abortion - 3rd trimester</option>
      <option value="Miscarriage">Miscarriage - 1st trimester</option>
      <option value="Second trimester fetal loss">
        Second trimester fetal loss
      </option>
      <option value="Third trimester fetal loss">
        Third trimester fetal loss
      </option>
      <option value="Intra-uterine fetal death">
        Intra-uterine fetal death
      </option>
      <option value="Ectopic pregnancy">Ectopic Pregnancy</option>
      <option value="Vaginal birth">Vaginal birth</option>
      <option value="Vaginal birth - forceps">Vaginal birth - forceps</option>
      <option value="Vaginal birth - vacuum">Vaginal birth - vacuum</option>
      <option value="Cesarean section">Cesarean section</option>
    </select>
  );
};

export default PregnanciesList;
