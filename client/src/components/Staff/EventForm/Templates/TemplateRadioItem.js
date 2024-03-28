import React from "react";

const TemplateRadioItem = ({
  templateName,
  handleTemplateChange,
  isTemplateSelected,
}) => {
  return (
    <div className="invitation__radio-item">
      <input
        type="radio"
        name={templateName}
        id={templateName}
        value={templateName}
        onChange={handleTemplateChange}
        checked={isTemplateSelected(templateName)}
      />
      <label htmlFor={templateName}>{templateName}</label>
    </div>
  );
};

export default TemplateRadioItem;
