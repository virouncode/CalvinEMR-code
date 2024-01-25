import React from "react";
import TemplateRadioItem from "./TemplateRadioItem";

const TemplatesRadio = ({
  handleTemplateChange,
  templateSelected,
  templates,
  label = true,
}) => {
  //Rooms vector with all Rooms
  const isTemplateSelected = (templateName) => {
    return templateSelected === templateName;
  };
  return (
    <>
      {label && <label>Choose a template</label>}
      <div className="invitation__radio">
        {templates.map((template) => (
          <TemplateRadioItem
            key={template.name}
            templateName={template.name}
            handleTemplateChange={handleTemplateChange}
            isTemplateSelected={isTemplateSelected}
          />
        ))}
      </div>
    </>
  );
};

export default TemplatesRadio;
