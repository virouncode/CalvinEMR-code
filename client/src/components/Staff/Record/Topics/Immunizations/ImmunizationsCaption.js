import React from "react";

const ImmunizationsCaption = () => {
  const handleClickInfos = () => {
    const docWindow = window.open(
      "https://health.gov.on.ca/en/pro/programs/immunization/docs/Publicly_Funded_ImmunizationSchedule.pdf",
      "_blank",
      `resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=800, height=1000, left=0, top=0`
    );
    if (docWindow === null) {
      alert("Please disable your browser pop-up blocker and sign in again");
      window.location.assign("/login");
      return;
    }
  };
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
      <span style={{ color: "crimson" }}>Late</span>
      <span>{"\u25C6"} : intramuscular</span>
      <span>{"\u25A0"} : subcutaneous</span>
      <span>{"\u25B2"} : mouth</span>
      <span
        style={{
          textDecoration: "underline",
          cursor: "pointer",
          color: "blue",
          marginLeft: "10px",
        }}
        onClick={handleClickInfos}
      >
        More infos
      </span>
    </div>
  );
};

export default ImmunizationsCaption;
