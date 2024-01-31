import React from "react";
import MedTemplateItem from "./MedTemplateItem";

const MedsTemplatesList = ({ medsTemplates, body, setBody }) => {
  return (
    <div className="prescription__templates-list">
      <p style={{ fontWeight: "bold" }}>Medications templates</p>
      <ul>
        {medsTemplates &&
          medsTemplates.map((med) => (
            <MedTemplateItem
              med={med}
              key={med.id}
              setBody={setBody}
              body={body}
            />
          ))}
      </ul>
    </div>
  );
};

export default MedsTemplatesList;
