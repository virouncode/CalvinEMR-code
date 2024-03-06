import React from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useSocketContext from "../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";
import { toLocalDateAndTime } from "../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/toPatientName";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";

const MessageExternalThumbnail = ({
  message,
  setCurrentMsgId,
  setMsgsSelectedIds,
  msgsSelectedIds,
  section,
  lastItemRef = null,
}) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const { socket } = useSocketContext();

  const handleMsgClick = async (e) => {
    if (!message.read_by_staff_id) {
      //create and replace message with read by user id
      try {
        const datasToPut = {
          ...message,
          read_by_staff_id: user.id,
          attachments_ids: message.attachments_ids.map(
            ({ attachment }) => attachment.id
          ), //reformatted because of Add-on
          previous_messages_ids: message.previous_messages_ids.map(
            ({ previous_message }) => previous_message.id
          ), //reformatted because of Add-on
        };
        delete datasToPut.to_patient_infos; //From Add-On
        delete datasToPut.from_patient_infos; //From Add-on
        const response = await xanoPut(
          "/messages_external",
          axiosXanoStaff,
          auth.authToken,
          datasToPut,
          message.id
        );
        socket.emit("message", {
          route: "MESSAGES INBOX EXTERNAL",
          action: "update",
          content: { id: message.id, data: response.data },
        });
        socket.emit("message", {
          route: "MESSAGES WITH PATIENT",
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
    if (user.unreadMessagesExternalNbr !== 0) {
      const newUnreadMessagesExternalNbr = user.unreadMessagesExternalNbr - 1;
      socket.emit("message", {
        route: "USER",
        action: "update",
        content: {
          id: user.id,
          data: {
            ...user,
            unreadMessagesExternalNbr: newUnreadMessagesExternalNbr,
            unreadNbr: newUnreadMessagesExternalNbr + user.unreadMessagesNbr,
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
          deleted_by_staff_id: user.id,
          attachments_ids: message.attachments_ids.map(
            ({ attachment }) => attachment.id
          ), //Reformatted beause of Add-On
          previous_messages_ids: message.previous_messages_ids.map(
            ({ previous_message }) => previous_message.id
          ), //Reformatted beause of Add-On
        };
        delete datasToPut.to_patient_infos; //From Add-On
        delete datasToPut.from_patient_infos; //From Add-On
        const response = await xanoPut(
          "/messages_external",
          axiosXanoStaff,
          auth.authToken,
          datasToPut,
          message.id
        );
        socket.emit("message", {
          route: "MESSAGES INBOX EXTERNAL",
          action: "update",
          content: {
            id: message.id,
            data: response.data,
          },
        });
        socket.emit("message", {
          route: "MESSAGES WITH PATIENT",
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
        message.to_staff_id &&
        message.to_staff_id === user.id &&
        !message.read_by_staff_id
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
      <div
        onClick={handleMsgClick}
        className="message-thumbnail__link message-thumbnail__link--external"
      >
        <div className="message-thumbnail__author">
          {section !== "Sent messages" //messages reçus ou effacés
            ? message.from_patient_id //le "From" est un patient
              ? toPatientName(message.from_patient_infos)
              : staffIdToTitleAndName(staffInfos, message.from_staff_id, true)
            : /*messages envoyés, le "To" est forcément un patient*/
              toPatientName(message.to_patient_infos)}
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
