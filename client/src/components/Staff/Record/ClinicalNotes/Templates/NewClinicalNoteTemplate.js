import React, { useState } from "react";
import { toast } from "react-toastify";

import xanoPost from "../../../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import ToastCalvin from "../../../../UI/Toast/ToastCalvin";
import CopyTemplatesList from "./CopyTemplatesList";

const NewClinicalNoteTemplate = ({ setNewTemplateVisible, templates }) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [copyTemplateSelectedId, setCopyTemplateSelectedId] = useState("");
  const [newTemplate, setNewTemplate] = useState({ name: "", body: "" });
  const [errMsg, setErrMsg] = useState("");

  const handleSelectCopyTemplate = (e) => {
    setErrMsg("");
    const value = parseInt(e.target.value);
    setCopyTemplateSelectedId(value);
    setNewTemplate({
      ...newTemplate,
      body: templates.find(({ id }) => id === value).body,
    });
  };
  const handleChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setNewTemplate({ ...newTemplate, [name]: value });
  };

  const handleCancel = () => {
    setErrMsg("");
    setNewTemplateVisible(false);
  };

  const handleSave = async () => {
    if (!newTemplate.name) {
      setErrMsg("Please enter a name for your template");
      return;
    }
    const templateToSave = { ...newTemplate };
    templateToSave.date_created = nowTZTimestamp();
    templateToSave.author_id = user.id;
    try {
      const response = await xanoPost(
        "/clinical_notes_templates",
        "staff",

        templateToSave
      );
      socket.emit("message", {
        route: "CLINICAL TEMPLATES",
        action: "create",
        content: { data: response.data },
      });
      setNewTemplateVisible(false);
      toast.success("Template saved succesfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to save template: ${err.message}`, {
        containerId: "B",
      });
    }
  };
  return (
    <div className="new-template">
      {errMsg && <p className="new-template-err">{errMsg}</p>}
      <div className="new-template-title">
        Please write a new template or copy{" "}
        <CopyTemplatesList
          templates={templates}
          copyTemplateSelectedId={copyTemplateSelectedId}
          handleSelectCopyTemplate={handleSelectCopyTemplate}
        />
      </div>
      <div className="new-template-name">
        <input
          type="text"
          name="name"
          value={newTemplate.name}
          onChange={handleChange}
          placeholder="New template name"
          autoComplete="off"
        />
      </div>
      <div className="new-template-body">
        <textarea
          name="body"
          value={newTemplate.body}
          onChange={handleChange}
        />
      </div>
      <div className="new-template-btns">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
      <ToastCalvin id="B" />
    </div>
  );
};

export default NewClinicalNoteTemplate;
