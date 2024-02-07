import React from "react";

const AddedMedItem = ({
  med,
  addedMeds,
  setAddedMeds,
  body,
  setFinalInstructions,
}) => {
  const handleRemoveFromRx = (e) => {
    e.stopPropagation();
    setAddedMeds(addedMeds.filter(({ temp_id }) => temp_id !== med.temp_id));
    setFinalInstructions(
      addedMeds
        .filter(({ temp_id }) => temp_id !== med.temp_id)
        .map(({ PrescriptionInstructions }) => PrescriptionInstructions)
        .join("\n\n") +
        "\n\n" +
        body
    );
  };

  const handleChangeItemInstruction = (e) => {
    const value = e.target.value;
    setAddedMeds(
      addedMeds.map((addedMed) => {
        return addedMed.temp_id === med.temp_id
          ? { ...addedMed, PrescriptionInstructions: value }
          : addedMed;
      })
    );
    setFinalInstructions(
      addedMeds
        .map((addedMed) => {
          return addedMed.temp_id === med.temp_id
            ? { ...addedMed, PrescriptionInstructions: value }
            : addedMed;
        })
        .map(({ PrescriptionInstructions }) => PrescriptionInstructions)
        .join("\n\n") +
        "\n\n" +
        body
    );
  };

  return (
    <li className="prescription__item">
      <div>
        <textarea
          className="prescription__item-textarea"
          value={med.PrescriptionInstructions}
          onChange={handleChangeItemInstruction}
        />
        <i
          className="fa-solid fa-trash"
          style={{ marginLeft: "5px", cursor: "pointer" }}
          onClick={handleRemoveFromRx}
        ></i>
      </div>
    </li>
  );
};

export default AddedMedItem;
