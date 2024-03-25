import React, { useState } from "react";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import EmptyLi from "../../../All/UI/Lists/EmptyLi";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import EditTemplate from "./EditTemplate";
import NewTemplate from "./NewTemplate";

const ClinicalNotesTemplates = ({ templates, handleSelectTemplate }) => {
  const { staffInfos } = useStaffInfosContext();
  const { user } = useUserContext();
  const [editTemplateVisible, setEditTemplateVisible] = useState(false);
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [templateToEditId, setTemplateToEditId] = useState();
  const [search, setSearch] = useState("");
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      staffIdToTitleAndName(staffInfos, template.author_id)
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const handleEdit = (e, templateId) => {
    setTemplateToEditId(templateId);
    setEditTemplateVisible(true);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleAddNew = (e) => {
    e.preventDefault();
    setNewTemplateVisible((v) => !v);
  };

  return (
    <div className="clinical-notes__templates">
      <div className="clinical-notes__templates-btn-container">
        <button onClick={handleAddNew}>Add a new template</button>
      </div>
      <div className="clinical-notes__templates-search">
        <label htmlFor="template-search">Search</label>
        <input
          id="template-search"
          type="text"
          value={search}
          onChange={handleSearch}
          autoComplete="off"
          placeholder="Template, author name"
        />
      </div>
      <div className="clinical-notes__templates-list">
        <ul>
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <li
                className="clinical-notes__templates-list-item"
                key={template.id}
                onClick={(e) => handleSelectTemplate(e, template.id)}
              >
                {template.name} (
                {staffIdToTitleAndName(staffInfos, template.author_id)})
                {user.id === template.author_id && (
                  <i
                    className="fa-solid fa-pen-to-square"
                    style={{ marginLeft: "5px" }}
                    onClick={(e) => handleEdit(e, template.id)}
                  ></i>
                )}
              </li>
            ))
          ) : (
            <EmptyLi text="No results found" />
          )}
        </ul>
      </div>
      {newTemplateVisible && (
        <FakeWindow
          title="NEW TEMPLATE"
          width={1000}
          height={500}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 500) / 2}
          color="#93b5e9"
          setPopUpVisible={setNewTemplateVisible}
          closeCross={false}
        >
          <NewTemplate
            setNewTemplateVisible={setNewTemplateVisible}
            templates={templates}
          />
        </FakeWindow>
      )}
      {editTemplateVisible && (
        <FakeWindow
          title="EDIT TEMPLATE"
          width={1000}
          height={500}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 500) / 2}
          color="#93b5e9"
          setPopUpVisible={setEditTemplateVisible}
        >
          <EditTemplate
            setEditTemplateVisible={setEditTemplateVisible}
            templateToEdit={templates.find(({ id }) => id === templateToEditId)}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default ClinicalNotesTemplates;
