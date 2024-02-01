import React from "react";
import AddedMedItem from "./AddedMedItem";

const AddedMedsList = ({ addedMeds, setAddedMeds }) => {
  return (
    <ul className="prescription__list">
      {addedMeds.map((med) => (
        <AddedMedItem
          med={med}
          setAddedMeds={setAddedMeds}
          addedMeds={addedMeds}
        />
      ))}
    </ul>
  );
};

export default AddedMedsList;
