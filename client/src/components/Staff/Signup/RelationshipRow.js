import React from "react";
import PatientsSelect from "../../All/UI/Lists/PatientsSelect";
import RelationshipList from "../../All/UI/Lists/RelationshipList";

const RelationshipRow = ({
  item,
  handleChange,
  handleDeleteRelationship,
  handleRelationshipChange,
}) => {
  return (
    <div className="signup-patient__row-relationship">
      <RelationshipList
        itemId={item.id}
        handleChange={handleRelationshipChange}
        value={item.relationship}
      />{" "}
      of{" "}
      <PatientsSelect
        id={item.id}
        handleChange={handleChange}
        value={item.relation_id}
        name="relation_id"
      />
      <i
        id={item.id}
        className="fa-solid fa-trash"
        onClick={handleDeleteRelationship}
        style={{ cursor: "pointer" }}
      ></i>
    </div>
  );
};

export default RelationshipRow;
