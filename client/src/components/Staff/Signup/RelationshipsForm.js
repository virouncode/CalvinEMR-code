import React, { useRef } from "react";
import RelationshipRow from "./RelationshipRow.js";

const RelationshipsForm = ({ relationships, setRelationships }) => {
  const idCounter = useRef(0);

  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    let updatedRelationships = [...relationships];
    //ne pas prendre l'index mais filtrer sur l'id
    updatedRelationships = updatedRelationships.map((item) => {
      if (item.id === parseInt(e.target.id)) {
        return { ...item, relation_id: value };
      } else return item;
    });
    setRelationships(updatedRelationships);
  };

  const handleRelationshipChange = (value, itemId) => {
    let updatedRelationships = [...relationships];
    updatedRelationships = updatedRelationships.map((item) => {
      if (item.id === parseInt(itemId)) {
        return { ...item, relationship: value };
      } else {
        return item;
      }
    });
    setRelationships(updatedRelationships);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setRelationships([
      ...relationships,
      { relation_id: "", relationship: "", id: idCounter.current },
    ]);
    idCounter.current = idCounter.current + 1;
  };

  const handleDeleteRelationship = (e) => {
    let updatedRelationships = [...relationships];
    updatedRelationships = updatedRelationships.filter(
      ({ id }) => id !== parseInt(e.target.id)
    );
    setRelationships(updatedRelationships);
  };
  return (
    <>
      <div className="signup-patient__row">
        <label>Relationships: </label>
        <button onClick={handleAdd}>Add a relationship</button>
      </div>
      {relationships.length !== 0 &&
        relationships.map((item) => (
          <RelationshipRow
            item={item}
            handleChange={handleChange}
            handleDeleteRelationship={handleDeleteRelationship}
            handleRelationshipChange={handleRelationshipChange}
            key={item.id}
          />
        ))}
    </>
  );
};

export default RelationshipsForm;
