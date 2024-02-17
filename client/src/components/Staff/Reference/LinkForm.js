import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import { linkSchema } from "../../../validation/linkValidation";

const LinkForm = ({ myLinks, setAddVisible }) => {
  const { user, auth, clinic, socket } = useAuthContext();
  const [newLink, setNewLink] = useState({ name: "", url: "" });
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
    if (myLinks.find(({ name }) => name === newLink.name)) {
      setErrMsg("You already have a link with this name");
      return;
    }
    let urlFormatted;
    if (!newLink.url.includes("http") || !newLink.url.includes("https")) {
      urlFormatted = ["https://", newLink.url].join("");
    }
    try {
      const userInfos = clinic.staffInfos.find(({ id }) => id === user.id);
      const datasToPut = {
        ...userInfos,
        links: [...userInfos.links, { name: newLink.name, url: urlFormatted }],
      };
      await axiosXanoStaff.put(`/staff/${user.id}`, datasToPut, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      setAddVisible(false);
      socket.emit("message", {
        route: "STAFF",
        action: "update",
        content: { id: user.id, data: datasToPut },
      });
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
