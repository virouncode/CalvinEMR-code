import React from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDateAndTime } from "../../../../utils/formatDates";
import { patientIdToName } from "../../../../utils/patientIdToName";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";

const MessageExternalThumbnail = ({
  message,
  setCurrentMsgId,
  setMsgsSelectedIds,
  msgsSelectedIds,
  section,
}) => {
  const { auth, user, clinic, socket } = useAuth();

  const handleMsgClick = async (e) => {
    if (!message.read_by_staff_id) {
      //create and replace message with read by user id
      try {
        const newMessage = {
          ...message,
          read_by_staff_id: user.id,
        };
        await axiosXanoStaff.put(
          `/messages_external/${message.id}`,
          newMessage,
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        socket.emit("message", {
          route: "MESSAGES INBOX EXTERNAL",
          action: "update",
          content: { id: message.id, data: newMessage },
        });
      } catch (err) {
        toast.error(`Error: unable to get messages: ${err.message}`, {
          containerId: "A",
        });
      }
    }
    //Remove one from the unread messages nbr counter
    if (user.unreadMessagesExternalNbr !== 0) {
      const newUnreadMessagesExternalNbr = user.unreadMessagesExternalNbr - 1;
      socket.emit("message", {
        route: "UNREAD",
        userType: "staff",
        userId: user.id,
        type: "external",
        content: {
          data: {
            unreadMessagesExternalNbr: newUnreadMessagesExternalNbr,
            unreadNbr: user.unreadMessagesNbr + newUnreadMessagesExternalNbr,
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
        await axiosXanoStaff.put(
          `/messages_external/${message.id}`,
          {
            ...message,
            deleted_by_staff_id: user.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        socket.emit("message", {
          route: "MESSAGES INBOX EXTERNAL",
          action: "update",
          content: {
            id: message.id,
            data: {
              ...message,
              deleted_by_staff_id: user.id,
            },
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
        message.to_id === user.id &&
        message.to_user_type === "staff" &&
        !message.read_by_staff_id
          ? "message-thumbnail message-thumbnail--unread"
          : "message-thumbnail"
      }
    >
      <input
        className="message-thumbnail__checkbox"
        type="checkbox"
        id={message.id}
        checked={isMsgSelected(message.id)}
        onChange={handleCheckMsg}
      />
      <div
        onClick={handleMsgClick}
        className="message-thumbnail__link message-thumbnail__link--external"
      >
        <div className="message-thumbnail__author">
          {section !== "Sent messages" //messages reçus ou effacés
            ? message.from_user_type === "patient" //le "From" est un patient ou un staff
              ? patientIdToName(clinic.demographicsInfos, message.from_id)
              : staffIdToTitleAndName(clinic.staffInfos, message.from_id, true)
            : /*messages envoyés, le "To" est forcément un patient*/
              patientIdToName(clinic.demographicsInfos, message.to_id)}
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
      <div className="message-thumbnail__date message-thumbnail__date--external">
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

export default MessageExternalThumbnail;
