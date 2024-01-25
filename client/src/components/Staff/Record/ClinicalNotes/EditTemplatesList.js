import React from "react";

const EditTemplatesList = ({
  myTemplates,
  editTemplateSelectedId,
  handleSelectEditTemplate,
}) => {
  return (
    <select value={editTemplateSelectedId} onChange={handleSelectEditTemplate}>
      <option disabled value="">
        my templates
      </option>
      {myTemplates.map((template) => (
        <option key={template.id} value={template.id}>
          {template.name}
        </option>
      ))}
    </select>
  );
};

export default EditTemplatesList;
