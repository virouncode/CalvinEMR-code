import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import useUserContext from "../../../hooks/useUserContext";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import LinkEdit from "./LinkEdit";
import useSocketContext from "../../../hooks/useSocketContext";
import xanoDelete from "../../../api/xanoDelete";

const MyLinkItem = ({ link, setAddVisible }) => {
  const { user } = useUserContext();
  const { auth } = useAuthContext();
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);
  const handleEdit = () => {
    setEditVisible((v) => !v);
  };
  const handleRemoveLink = async (e, linkName) => {
    if (
      await confirmAlert({ content: "Do you reall want to remove this link ?" })
    ) {
      try {
        await xanoDelete("/links", axiosXanoStaff, auth.authToken, link.id);
        socket.emit("message", {
          route: "LINKS",
          action: "delete",
          content: { id: link.id },
        });
        setAddVisible(false);
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
      {editVisible && <LinkEdit link={link} setEditVisible={setEditVisible} />}
    </li>
  );
};

export default MyLinkItem;
