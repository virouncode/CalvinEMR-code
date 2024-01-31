import React from "react";

const ImmunizationsCaption = () => {
  return (
    <div
      style={{
        fontFamily: "Arial",
        fontSize: "0.75rem",
        border: "solid 1px black",
        borderRadius: "3px",
        padding: "5px 10px",
        display: "flex",
        width: "33%",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ color: "forestgreen" }}>Done</span>
      <span style={{ color: "orange" }}>Late</span>
      <span style={{ color: "red" }}>Refused</span>
      <span>{"\u25C6"} : intramuscular</span>
      <span>{"\u25A0"} : subcutaneous</span>
      <span>{"\u25B2"} : mouth</span>
    </div>
  );
};

export default ImmunizationsCaption;
