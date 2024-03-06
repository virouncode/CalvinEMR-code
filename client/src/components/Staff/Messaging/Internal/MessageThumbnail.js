import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useSocketContext from "../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";
import { toLocalDateAndTime } from "../../../../utils/formatDates";
import { staffIdListToTitleAndName } from "../../../../utils/staffIdListToTitleAndName";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/toPatientName";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";

const MessageThumbnail = ({
  message,
  setCurrentMsgId,
  setMsgsSelectedIds,
  msgsSelectedIds,
  section,
  lastItemRef = null,
}) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();

  const handleMsgClick = async (e) => {
    if (!message.read_by_staff_ids.includes(user.id)) {
      //create and replace message with read by user id
      try {
        const datasToPut = {
          ...message,
          read_by_staff_ids: [...message.read_by_staff_ids, user.id],
          attachments_ids: message.attachments_ids.map(
            ({ attachment }) => attachment.id
          ), //reformatted because off add-on
        };
        delete datasToPut.patient_infos; //from add-On
        const response = await xanoPut(
          "/messages",
          axiosXanoStaff,
          auth.authToken,
          datasToPut,
          message.id
        );
        socket.emit("message", {
          route: "MESSAGES INBOX",
          action: "update",
          content: { id: message.id, data: response.data },
        });
        socket.emit("message", {
          route: "MESSAGES ABOUT PATIENT",
          action: "update",
          content: { id: message.id, data: response.data },
        });
      } catch (err) {
        toast.error(`Error: unable to get messages: ${err.message}`, {
          containerId: "A",
        });
      }
    }
    //Remove one from the unread messages nbr counter
    if (user.unreadMessagesNbr !== 0) {
      const newUnreadMessagesNbr = user.unreadMessagesNbr - 1;
      socket.emit("message", {
        route: "USER",
        action: "update",
        content: {
          id: user.id,
          data: {
            ...user,
            unreadMessagesNbr: newUnreadMessagesNbr,
            unreadNbr: newUnreadMessagesNbr + user.unreadMessagesExternalNbr,
          },
        },
      });
    }
    setCurrentMsgId(message.id);
  };

  const handleCheckMsg = (e) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    if (checked) {
      if (!msgsSelectedIds.includes(id)) {
        setMsgsSelectedIds([...msgsSelectedIds, id]);
      }
    } else {
      let msgsSelectedIdsUpdated = [...msgsSelectedIds];
      msgsSelectedIdsUpdated = msgsSelectedIdsUpdated.filter(
        (messageId) => messageId !== id
      );
      setMsgsSelectedIds(msgsSelectedIdsUpdated);
    }
  };

  const isMsgSelected = (id) => {
    return msgsSelectedIds.includes(parseInt(id));
  };

  const handleDeleteMsg = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to remove this message ?",
      })
    ) {
      try {
        const datasToPut = {
          ...message,
          deleted_by_staff_ids: [...message.deleted_by_staff_ids, user.id],
          attachments_ids: message.attachments_ids.map(
            ({ attachment }) => attachment.id
          ), //reformatted because off add-on
        };
        delete datasToPut.patient_infos; //from add-on
        const response = await xanoPut(
          "/messages",
          axiosXanoStaff,
          auth.authToken,
          datasToPut,
          message.id
        );
        socket.emit("message", {
          route: "MESSAGES INBOX",
          action: "update",
          content: {
            id: message.id,
            data: response.data,
          },
        });
        socket.emit("message", {
          route: "MESSAGES ABOUT PATIENT",
          action: "update",
          content: {
            id: message.id,
            data: response.data,
          },
        });
        toast.success("Message deleted successfully", { containerId: "A" });
        setMsgsSelectedIds([]);
      } catch (err) {
        toast.error(`Error: unable to delete message: ${err.message}`, {
          containerId: "A",
        });
      }
    }
  };

  return (
    <div
      className={
        message.to_staff_ids.includes(user.id) &&
        !message.read_by_staff_ids.includes(user.id)
          ? "message-thumbnail message-thumbnail--unread"
          : "message-thumbnail"
      }
      ref={lastItemRef}
    >
      <input
        className="message-thumbnail__checkbox"
        type="checkbox"
        id={message.id}
        checked={isMsgSelected(message.id)}
        onChange={handleCheckMsg}
      />
      <div onClick={handleMsgClick} className="message-thumbnail__link">
        <div className="message-thumbnail__author">
          {section !== "Sent messages"
            ? staffIdToTitleAndName(staffInfos, message.from_id, true)
            : staffIdListToTitleAndName(staffInfos, message.to_staff_ids)}
        </div>
        <div className="message-thumbnail__sample">
          <span>{message.subject}</span> - {message.body}{" "}
          {message.attachments_ids.length !== 0 && (
            <i
              className="fa-solid fa-paperclip"
              style={{ marginLeft: "5px" }}
            ></i>
          )}
        </div>
      </div>
      <div className="message-thumbnail__patient">
        {message.related_patient_id ? (
          <NavLink
            to={`/staff/patient-record/${message.related_patient_id}`}
            className="message-thumbnail__patient-link"
            target="_blank"
          >
            {toPatientName(message.patient_infos)}
          </NavLink>
        ) : null}
      </div>
      <div className="message-thumbnail__date">
        {toLocalDateAndTime(message.date_created)}
      </div>
      <div className="message-thumbnail__logos">
        {section !== "Deleted messages" && (
          <i
            className="fa-solid fa-trash  message-thumbnail__trash"
            style={{ cursor: "pointer" }}
            onClick={handleDeleteMsg}
          ></i>
        )}
      </div>
    </div>
  );
};

export default MessageThumbnail;
