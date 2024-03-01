import React from "react";

const ClinicalNotesOrderRadio = ({ order, handleChangeOrder }) => {
  return (
    <div className="clinical-notes__order">
      <p>Most recent on:</p>
      <div className="clinical-notes__radio-item">
        <input
          type="radio"
          name="order"
          value="desc"
          id="top"
          onChange={handleChangeOrder}
          checked={order === "desc"}
        />
        <label htmlFor="top">Top</label>
      </div>
      <div className="clinical-notes__radio-item">
        <input
          type="radio"
          name="order"
          value="asc"
          id="bottom"
          onChange={handleChangeOrder}
          checked={order === "asc"}
        />
        <label htmlFor="bottom">Bottom</label>
      </div>
    </div>
  );
};

export default ClinicalNotesOrderRadio;
