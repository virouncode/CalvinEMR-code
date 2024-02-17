import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import LinkEdit from "./LinkEdit";

const MyLinkItem = ({ myLinks, link, setAddVisible }) => {
  const { user, auth, clinic, socket } = useAuthContext();
  const [editVisible, setEditVisible] = useState(false);
  const handleEdit = () => {
    setEditVisible((v) => !v);
  };
  const handleRemoveLink = async (e, linkName) => {
    if (
      await confirmAlert({ content: "Do you reall want to remove this link ?" })
    ) {
      const myNewLinks = [...myLinks].filter(({ name }) => name !== linkName);
      try {
        const userInfos = clinic.staffInfos.find(({ id }) => id === user.id);
        const datasToPut = { ...userInfos, links: myNewLinks };
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
        toast.success("Link deleted successfully", { containerId: "A" });
      } catch (err) {
        toast.error(`Unable to delete link:${err.message}`);
      }
    }
  };

  return (
    <li key={link.name}>
      <a href={link.url} target="_blank" rel="noreferrer">
        {link.name}
      </a>
      <i
        className="fa-regular fa-pen-to-square"
        style={{ cursor: "pointer", marginLeft: "5px" }}
        onClick={handleEdit}
      ></i>
      <i
        className="fa-solid fa-trash"
        style={{ cursor: "pointer", marginLeft: "5px" }}
        onClick={(e) => handleRemoveLink(e, link.name)}
      ></i>
      {editVisible && (
        <LinkEdit
          link={link}
          myLinks={myLinks}
          setEditVisible={setEditVisible}
        />
      )}
    </li>
  );
};

export default MyLinkItem;
