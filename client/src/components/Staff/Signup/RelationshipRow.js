import React from "react";
import PatientsSelect from "../../All/UI/Lists/PatientsSelect";
import RelationshipList from "../../All/UI/Lists/RelationshipList";

const RelationshipRow = ({
  item,
  handleChange,
  handleDeleteRelationship,
  handleRelationshipChange,
  patients,
  setPaging,
  loading,
  hasMore,
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
        id={item.id} //the id of each item to relate the select element to my relationship
        handleChange={handleChange}
        value={item.relation_id}
        name="relation_id"
        patients={patients}
        setPaging={setPaging}
        loading={loading}
        hasMore={hasMore}
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
