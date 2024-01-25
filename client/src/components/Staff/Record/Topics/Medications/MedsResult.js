import React from "react";

const MedsResult = ({ results, handleMedClick }) => {
  const handleMouseEnter = (e) => {
    e.target.style.background = "#94bae8";
  };
  const handleMouseLeave = (e) => {
    e.target.style.background = "#FEFEFE";
  };
  return (
    results &&
    results.length !== 0 && (
      <div
        style={{
          border: "solid 1px black",
          borderRadius: "2px",
        }}
      >
        <ul
          style={{
            padding: "0",
            margin: "0",
            fontSize: "0.8rem",
            fontFamily: "Arial",
          }}
        >
          {results.map((med) => (
            <li
              style={{ listStyle: "none", padding: "5px", cursor: "pointer" }}
              key={med.drug_code}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleMedClick(med.brand_name, med.drug_code)}
            >
              {med.brand_name}
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

export default MedsResult;
