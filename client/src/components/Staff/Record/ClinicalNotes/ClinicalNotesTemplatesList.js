import React from "react";

const ClinicalNotesTemplatesList = ({
  templates,
  templateSelectedId,
  handleSelectTemplate,
}) => {
  return (
    <select value={templateSelectedId} onChange={handleSelectTemplate}>
      <option disabled value="">
        Select a template
      </option>
      <option value={"-1"}>New</option>
      <option value={"-2"}>Edit/Delete</option>
      <option style={{ fontSize: "1rem", backgroundColor: "#000000" }} disabled>
        -------------
      </option>
      {templates.map((template) => (
        <option key={template.id} value={template.id}>
          {template.name}
        </option>
      ))}
    </select>
  );
};

export default ClinicalNotesTemplatesList;
