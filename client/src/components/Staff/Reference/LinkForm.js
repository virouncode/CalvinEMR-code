import React, { useState } from "react";
import { toast } from "react-toastify";

import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../hooks/useSocketContext";
import useUserContext from "../../../hooks/useUserContext";
import { nowTZTimestamp } from "../../../utils/formatDates";
import { linkSchema } from "../../../validation/linkValidation";

const LinkForm = ({ links, setAddVisible }) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();

  const [newLink, setNewLink] = useState({
    name: "",
    url: "",
    staff_id: user.id,
  });
  const [errMsg, setErrMsg] = useState("");
  const [progress, setProgress] = useState(false);

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setNewLink({ ...newLink, [id]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await linkSchema.validate(newLink);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    if (links.find(({ name }) => name === newLink.name)) {
      setErrMsg("You already have a link with this name");
      return;
    }
    let urlFormatted;
    if (!newLink.url.includes("http") || !newLink.url.includes("https")) {
      urlFormatted = ["https://", newLink.url].join("");
    }
    try {
      setProgress(true);
      const response = await xanoPost("/links", "staff", {
        ...newLink,
        url: urlFormatted,
        date_created: nowTZTimestamp(),
      });
      socket.emit("message", {
        route: "LINKS",
        action: "create",
        content: { data: response.data },
      });
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "A" });
      setProgress(false);
    } catch (err) {
      toast.error(`Unable to save link:${err.message}`);
      setProgress(false);
    }
  };
  const handleCancel = (e) => {
    setAddVisible(false);
  };
  return (
    <form className="reference-links__form" onSubmit={handleSubmit}>
      {errMsg && <p className="reference-links__form-err">{errMsg}</p>}
      <div className="reference-links__form-row">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          value={newLink.name}
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
          value={newLink.url}
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

export default LinkForm;
