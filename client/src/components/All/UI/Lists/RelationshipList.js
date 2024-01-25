import React from "react";
import { Combobox } from "react-widgets";
import { relations } from "../../../../utils/relations";

const RelationshipList = ({ value, handleChange, itemId = 0 }) => {
  return (
    <Combobox
      placeholder="Choose a relationship"
      value={value}
      onChange={(value) => handleChange(value, itemId)}
      data={relations}
    />
  );
};

export default RelationshipList;
