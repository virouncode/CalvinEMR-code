import React from "react";

const AddedMedItem = ({ med, addedMeds, setAddedMeds }) => {
  const handleRemoveFromRx = (e) => {
    e.stopPropagation();
    setAddedMeds(addedMeds.filter(({ temp_id }) => temp_id !== med.temp_id));
  };
  return (
    <li className="prescription__item">
      - {med.PrescriptionInstructions}{" "}
      {/* <Tooltip title={"Remove from RX"} placement="top-start" arrow> */}
      <i
        className="fa-solid fa-trash"
        style={{ marginLeft: "5px", cursor: "pointer" }}
        onClick={handleRemoveFromRx}
      ></i>
      {/* </Tooltip> */}
    </li>
  );
};

export default AddedMedItem;
