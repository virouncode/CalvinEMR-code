import React from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";

const ClinicalNotesTemplatesList = ({
  templates,
  templateSelectedId,
  handleSelectTemplate,
}) => {
  const { staffInfos } = useStaffInfosContext();
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
          {template.name}{" "}
          {staffIdToTitleAndName(staffInfos, template.author_id)
            ? `(${staffIdToTitleAndName(staffInfos, template.author_id)})`
            : ""}
        </option>
      ))}
    </select>
  );
};

export default ClinicalNotesTemplatesList;
