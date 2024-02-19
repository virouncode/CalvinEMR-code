import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useSocketContext from "../../../../hooks/useSocketContext";
import useUserContext from "../../../../hooks/useUserContext";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import CopyTemplatesList from "./CopyTemplatesList";

const NewTemplate = ({
  setNewTemplateVisible,
  templates,
  setTemplateSelectedId,
  setFormDatas,
  formDatas,
}) => {
  const { auth } = useAuthContext();
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
    setTemplateSelectedId("");
  };

  const handleSave = async () => {
    if (!newTemplate.name) {
      setErrMsg("Please enter a name for your template");
      return;
    }
    const templateToSave = { ...newTemplate };
    templateToSave.date_created = Date.now();
    templateToSave.author_id = user.id;
    try {
      const response = await axiosXanoStaff.post(
        "/clinical_notes_templates",
        templateToSave,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      socket.emit("message", {
        route: "CLINICAL TEMPLATES",
        action: "create",
        content: { data: response.data },
      });
      setFormDatas({ ...formDatas, MyClinicalNotesContent: newTemplate.body });
      setTemplateSelectedId(response.data.id);
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

export default NewTemplate;
