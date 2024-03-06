import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoDelete from "../../../../api/xanoCRUD/xanoDelete";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useSocketContext from "../../../../hooks/useSocketContext";
import useUserContext from "../../../../hooks/useUserContext";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import EditTemplatesList from "./EditTemplatesList";

const EditTemplate = ({
  setEditTemplateVisible,
  myTemplates,
  setTemplateSelectedId,
  setFormDatas,
  formDatas,
}) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [editTemplateSelectedId, setEditTemplateSelectedId] = useState("");
  const [editedTemplate, setEditedTemplate] = useState({
    author_id: user.id,
    body: "",
    name: "",
  });

  const handleSelectEditTemplate = (e) => {
    const value = parseInt(e.target.value);
    setEditTemplateSelectedId(value);
    setEditedTemplate({
      ...editedTemplate,
      body: myTemplates.find(({ id }) => id === value).body,
      name: myTemplates.find(({ id }) => id === value).name,
    });
  };
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setEditedTemplate({ ...editedTemplate, [name]: value });
  };

  const handleCancel = () => {
    setEditTemplateVisible(false);
    setTemplateSelectedId("");
  };

  const handleDelete = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this template ?",
      })
    ) {
      try {
        await xanoDelete(
          "/clinical_notes_templates",
          axiosXanoStaff,
          auth.authToken,
          editTemplateSelectedId
        );
        socket.emit("message", {
          route: "CLINICAL TEMPLATES",
          action: "delete",
          content: { id: editTemplateSelectedId },
        });
        setEditTemplateVisible(false);
        setTemplateSelectedId("");
        setFormDatas({ ...formDatas, body: "" });
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error: unable to delete template: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  const handleSave = async () => {
    //save template
    const templateToPut = { ...editedTemplate };
    templateToPut.date_created = Date.now();
    try {
      const response = await xanoPut(
        "/clinical_notes_templates",
        axiosXanoStaff,
        auth.authToken,
        templateToPut,
        editTemplateSelectedId
      );
      socket.emit("message", {
        route: "CLINICAL TEMPLATES",
        action: "update",
        content: { id: editTemplateSelectedId, data: response.data },
      });
      setFormDatas({
        ...formDatas,
        MyClinicalNotesContent: editedTemplate.body,
      });
      setTemplateSelectedId(editTemplateSelectedId);
      setEditTemplateVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to save template: ${err.message}`, {
        containerId: "B",
      });
    }
  };
  return (
    <div className="edit-template">
      <div className="edit-template-title">
        Please choose a template to edit/delete in:{"   "}
        <EditTemplatesList
          myTemplates={myTemplates}
          editTemplateSelectedId={editTemplateSelectedId}
          handleSelectEditTemplate={handleSelectEditTemplate}
        />
      </div>
      <div className="edit-template-name">
        <label>Your template name: </label>
        <span>{editedTemplate.name}</span>
      </div>
      <div className="edit-template-body">
        <textarea
          name="body"
          value={editedTemplate.body}
          onChange={handleChange}
          readOnly={!editTemplateSelectedId}
        />
      </div>
      <div className="edit-template-btns">
        <button onClick={handleSave} disabled={!editTemplateSelectedId}>
          Save
        </button>
        <button onClick={handleDelete} disabled={!editTemplateSelectedId}>
          Delete
        </button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
      <ConfirmGlobal isPopUp={true} />
      <ToastCalvin id="B" />
    </div>
  );
};

export default EditTemplate;
