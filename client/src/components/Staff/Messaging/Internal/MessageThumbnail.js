import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import xanoDelete from "../../../../api/xanoCRUD/xanoDelete";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";
import { timestampToDateTimeStrTZ } from "../../../../utils/formatDates";
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
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();

  const handleMsgClick = async (e) => {
    if (section !== "To-dos" && !message.read_by_staff_ids?.includes(user.id)) {
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
          `/messages/${message.id}`,
          "staff",
          datasToPut
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
        content: `Do you really want to delete this ${
          section === "To-dos" ? "to-do" : "message"
        } ?`,
      })
    ) {
      try {
        if (section === "To-dos") {
          const attachmentsIdsToDelete = message.attachments_ids.map(
            ({ attachment }) => attachment.id
          );
          for (let attachmentId of attachmentsIdsToDelete) {
            await xanoDelete(`/messages_attachments/${attachmentId}`, "staff");
          }
          await xanoDelete(`/todos/${message.id}`, "staff");
          socket.emit("message", {
            route: "MESSAGES INBOX",
            action: "delete",
            content: {
              id: message.id,
            },
          });
          socket.emit("message", {
            route: "TO-DOS ABOUT PATIENT",
            action: "delete",
            content: {
              id: message.id,
            },
          });
          toast.success("To-do deleted successfully", { containerId: "A" });
          setMsgsSelectedIds([]);
        } else {
          const datasToPut = {
            ...message,
            deleted_by_staff_ids: [...message.deleted_by_staff_ids, user.id],
            attachments_ids: message.attachments_ids.map(
              ({ attachment }) => attachment.id
            ), //reformatted because off add-on
          };
          delete datasToPut.patient_infos; //from add-on
          const response = await xanoPut(
            `/messages/${message.id}`,
            "staff",
            datasToPut
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
        }
      } catch (err) {
        toast.error(`Error: unable to delete message: ${err.message}`, {
          containerId: "A",
        });
      }
    }
  };

  const handleDone = async (e) => {
    e.stopPropagation();
    try {
      const datasToPut = {
        ...message,
        attachments_ids: message.attachments_ids.map(
          ({ attachment }) => attachment.id
        ),
        done: true,
      };
      delete datasToPut.patient_infos;
      const response = await xanoPut(
        `/todos/${message.id}`,
        "staff",
        datasToPut
      );
      socket.emit("message", {
        route: "MESSAGES INBOX",
        action: "update",
        content: { id: message.id, data: response.data },
      });
      socket.emit("message", {
        route: "TO-DOS ABOUT PATIENT",
        action: "update",
        content: { id: message.id, data: response.data },
      });
    } catch (err) {
      toast.error(`Unable to update to-do: ${err.message}`, {
        containerId: "A",
      });
    }
  };

  const handleUndone = async (e) => {
    e.stopPropagation();
    try {
      const datasToPut = {
        ...message,
        attachments_ids: message.attachments_ids.map(
          ({ attachment }) => attachment.id
        ),
        done: false,
      };
      delete datasToPut.patient_infos;
      const response = await xanoPut(
        `/todos/${message.id}`,
        "staff",
        datasToPut
      );
      socket.emit("message", {
        route: "MESSAGES INBOX",
        action: "update",
        content: { id: message.id, data: response.data },
      });
      socket.emit("message", {
        route: "TO-DOS ABOUT PATIENT",
        action: "update",
        content: { id: message.id, data: response.data },
      });
    } catch (err) {
      toast.error(`Unable to update to-do: ${err.message}`, {
        containerId: "A",
      });
    }
  };

  return (
    <div
      className={
        section !== "To-dos" &&
        message.to_staff_ids?.includes(user.id) &&
        !message.read_by_staff_ids?.includes(user.id)
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
        {section !== "To-dos" && (
          <div className="message-thumbnail__author">
            {section !== "Sent messages"
              ? staffIdToTitleAndName(staffInfos, message.from_id)
              : staffIdListToTitleAndName(staffInfos, message.to_staff_ids)}
          </div>
        )}
        <div className="message-thumbnail__sample">
          <span
            style={{
              textDecoration:
                section === "To-dos" && message.done && "line-through",
            }}
          >
            {message.subject} - {message.body}
          </span>{" "}
          {message.attachments_ids.length !== 0 && (
            <i
              className="fa-solid fa-paperclip"
              style={{ marginLeft: "5px" }}
            ></i>
          )}
          {section === "To-dos" &&
            (message.done ? (
              <button
                style={{
                  marginLeft: "5px",
                  fontSize: "0.7rem",
                  boxShadow: "none",
                }}
                onClick={handleUndone}
              >
                Undone
              </button>
            ) : (
              <button
                style={{
                  marginLeft: "5px",
                  fontSize: "0.7rem",
                  boxShadow: "none",
                }}
                onClick={handleDone}
              >
                Done
              </button>
            ))}
        </div>
      </div>
      <div className="message-thumbnail__patient">
        {message.related_patient_id ? (
          <NavLink
            to={`/staff/patient-record/${message.related_patient_id}`}
            className="message-thumbnail__patient-link"
            // target="_blank"
          >
            {toPatientName(message.patient_infos)}
          </NavLink>
        ) : null}
      </div>
      <div className="message-thumbnail__date">
        {timestampToDateTimeStrTZ(message.date_created)}
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
