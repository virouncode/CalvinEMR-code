import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoPost";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import useSocketContext from "../../../hooks/useSocketContext";
import useUserContext from "../../../hooks/useUserContext";
import { linkSchema } from "../../../validation/linkValidation";

const LinkForm = ({ links, setAddVisible }) => {
  const { user } = useUserContext();
  const { auth } = useAuthContext();
  const { socket } = useSocketContext();

  const [newLink, setNewLink] = useState({
    name: "",
    url: "",
    staff_id: user.id,
  });
  const [errMsg, setErrMsg] = useState("");
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
      const response = await xanoPost(
        "/links",
        axiosXanoStaff,
        auth.authToken,
        {
          ...newLink,
          url: urlFormatted,
          date_created: Date.now(),
        }
      );
      socket.emit("message", {
        route: "LINKS",
        action: "create",
        content: { data: response.data },
      });
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "A" });
    } catch (err) {
      toast.error(`Unable to save link:${err.message}`);
    }
  };
  const handleCancel = (e) => {
    setAddVisible(false);
  };
  return (
    <form className="reference__form" onSubmit={handleSubmit}>
      {errMsg && <p className="reference__form-err">{errMsg}</p>}
      <div className="reference__form-row">
        <label htmlFor="name">Enter a name</label>
        <input
          type="text"
          value={newLink.name}
          id="name"
          onChange={handleChange}
          autoComplete="off"
          autoFocus
        />
      </div>
      <div className="reference__form-row">
        <label htmlFor="url">Enter a URL</label>
        <input
          type="text"
          value={newLink.url}
          id="url"
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="reference__form-btns">
        <input type="submit" value="Save" />
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default LinkForm;
