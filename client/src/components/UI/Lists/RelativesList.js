import React from "react";
import { Combobox } from "react-widgets";
import "react-widgets/scss/styles.scss";
import { relatives } from "../../../utils/relationships/relatives";

const RelativesList = ({ value, handleChange }) => {
  return (
    <Combobox
      placeholder="Choose a relative"
      value={value}
      onChange={handleChange}
      data={relatives}
    />
  );
};

export default RelativesList;
