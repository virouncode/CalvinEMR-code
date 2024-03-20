import React, { useState } from "react";
import { toast } from "react-toastify";

import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/useSocketContext";
import { linkSchema } from "../../../validation/linkValidation";

const LinkEdit = ({ link, setEditVisible }) => {
  const [errMsg, setErrMsg] = useState("");
  const [editedLink, setEditedLink] = useState(link);
  const { socket } = useSocketContext();
  const [progress, setProgress] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await linkSchema.validate(editedLink);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    let urlFormatted = editedLink.url;
    if (!editedLink.url.includes("http") || !editedLink.url.includes("https")) {
      urlFormatted = ["https://", editedLink.url].join("");
    }
    try {
      setProgress(true);
      const response = await xanoPut(`/links/${link.id}`, "staff", {
        ...editedLink,
        url: urlFormatted,
      });
      socket.emit("message", {
        route: "LINKS",
        action: "update",
        content: { id: link.id, data: response.data },
      });
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "A" });
      setProgress(false);
    } catch (err) {
      toast.error(`Unable to save link:${err.message}`);
      setProgress(false);
    }
  };
  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.id;
    const value = e.target.value;
    setEditedLink({ ...editedLink, [name]: value });
  };
  const handleCancel = () => {
    setEditVisible(false);
  };
  return (
    <form className="reference-links__form" onSubmit={handleSubmit}>
      {errMsg && <p className="reference-links__form-err">{errMsg}</p>}
      <div className="reference-links__form-row">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          value={editedLink.name}
          id="name"
          onChange={handleChange}
          autoComplete="off"
          autoFocus
        />
      </div>
      <div className="reference-links__form-row">
        <label htmlFor="url">URL</label>
        <input
          type="text"
          value={editedLink.url}
          id="url"
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="reference-links__form-btns">
        <input type="submit" value="Save" disabled={progress} />
        <button onClick={handleCancel} disabled={progress}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default LinkEdit;
