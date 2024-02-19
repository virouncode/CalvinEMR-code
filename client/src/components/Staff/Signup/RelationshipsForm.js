import React, { useRef, useState } from "react";
import useFetchPatients from "../../../hooks/useFetchPatients.js";
import RelationshipRow from "./RelationshipRow.js";

const RelationshipsForm = ({ relationships, setRelationships }) => {
  const idCounter = useRef(0);

  //PATIENTS DATAS
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });
  const { patients, loading, errMsg, hasMore } = useFetchPatients(paging);

  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    setRelationships(
      relationships.map((item) => {
        return parseInt(item.id) === parseInt(e.target.id)
          ? { ...item, relation_id: value, gender: e.target.dataset.gender }
          : item;
      })
    );
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
      { relation_id: "", relationship: "", id: idCounter.current, gender: "" },
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
            patients={patients}
            hasMore={hasMore}
            loading={loading}
            errMsg={errMsg}
          />
        ))}
    </>
  );
};

export default RelationshipsForm;
