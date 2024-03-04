import React from "react";
import Combobox from "react-widgets/Combobox";

const GenericCombo = ({
  list,
  value,
  handleChange,
  handleSelect,
  placeHolder,
}) => {
  return (
    <Combobox
      placeholder={placeHolder || "Choose or type..."}
      value={value}
      onChange={(value) => handleChange(value)}
      data={list.map(({ name }) => name)}
    />
  );
};

export default GenericCombo;
