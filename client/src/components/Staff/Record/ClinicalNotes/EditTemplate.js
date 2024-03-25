import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import xanoDelete from "../../../../api/xanoCRUD/xanoDelete";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../hooks/useSocketContext";
import { nowTZTimestamp } from "../../../../utils/formatDates";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";

const EditTemplate = ({ setEditTemplateVisible, templateToEdit }) => {
  const { socket } = useSocketContext();
  const [editedTemplate, setEditedTemplate] = useState({});

  useEffect(() => {
    setEditedTemplate(templateToEdit);
  }, [templateToEdit]);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setEditedTemplate({ ...editedTemplate, [name]: value });
  };

  const handleCancel = () => {
    setEditTemplateVisible(false);
  };

  const handleDelete = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this template ?",
      })
    ) {
      try {
        await xanoDelete(
          `/clinical_notes_templates/${templateToEdit.id}`,
          "staff"
        );
        socket.emit("message", {
          route: "CLINICAL TEMPLATES",
          action: "delete",
          content: { id: templateToEdit.id },
        });
        setEditTemplateVisible(false);
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
    templateToPut.date_created = nowTZTimestamp();
    try {
      const response = await xanoPut(
        `/clinical_notes_templates/${templateToEdit.id}`,
        "staff",
        templateToPut
      );
      socket.emit("message", {
        route: "CLINICAL TEMPLATES",
        action: "update",
        content: { id: templateToEdit.id, data: response.data },
      });
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
      <div className="edit-template-name">
        <label>Template name: </label>
        <span>{editedTemplate.name}</span>
      </div>
      <div className="edit-template-body">
        <textarea
          name="body"
          value={editedTemplate.body}
          onChange={handleChange}
        />
      </div>
      <div className="edit-template-btns">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
      <ConfirmGlobal isPopUp={true} />
      <ToastCalvin id="B" />
    </div>
  );
};

export default EditTemplate;
