import React from "react";
import AddedMedItem from "./AddedMedItem";

const AddedMedsList = ({
  addedMeds,
  setAddedMeds,
  body,
  setFinalInstructions,
}) => {
  return (
    <ul className="prescription__list">
      {addedMeds.map((med) => (
        <AddedMedItem
          med={med}
          setAddedMeds={setAddedMeds}
          addedMeds={addedMeds}
          body={body}
          setFinalInstructions={setFinalInstructions}
          key={med.temp_id}
        />
      ))}
    </ul>
  );
};

export default AddedMedsList;
