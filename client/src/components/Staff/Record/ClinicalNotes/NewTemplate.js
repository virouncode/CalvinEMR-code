import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuth from "../../../../hooks/useAuth";
import CopyTemplatesList from "./CopyTemplatesList";

const NewTemplate = ({
  setNewTemplateVisible,
  templates,
  setTemplateSelectedId,
  setTemplates,
  setFormDatas,
  formDatas,
}) => {
  const { auth, user } = useAuth();
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
        "/progress_notes_templates",
        templateToSave,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      //reload templates :
      const response2 = await axiosXanoStaff.get("/progress_notes_templates", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      setTemplates(
        response2.data.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        )
      );
      setFormDatas({ ...formDatas, body: newTemplate.body });
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
      <ToastContainer
        enableMultiContainer
        containerId={"B"}
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
    </div>
  );
};

export default NewTemplate;
