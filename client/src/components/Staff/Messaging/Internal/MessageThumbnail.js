import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDateAndTime } from "../../../../utils/formatDates";
import { patientIdToName } from "../../../../utils/patientIdToName";
import { staffIdListToTitleAndName } from "../../../../utils/staffIdListToTitleAndName";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";

const MessageThumbnail = ({
  message,
  setCurrentMsgId,
  setMsgsSelectedIds,
  msgsSelectedIds,
  section,
}) => {
  const { auth, user, clinic, socket } = useAuth();
  const patient = clinic.demographicsInfos.find(
    ({ patient_id }) => patient_id === message.related_patient_id
  );

  const handleMsgClick = async (e) => {
    if (!message.read_by_staff_ids.includes(user.id)) {
      //create and replace message with read by user id
      try {
        const newMessage = {
          ...message,
          read_by_staff_ids: [...message.read_by_staff_ids, user.id],
        };
        await axiosXanoStaff.put(`/messages/${message.id}`, newMessage, {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
            "Content-Type": "application/json",
          },
        });
        socket.emit("message", {
          route: "MESSAGES INBOX",
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
    if (user.unreadMessagesNbr !== 0) {
      const newUnreadMessagesNbr = user.unreadMessagesNbr - 1;
      socket.emit("message", {
        route: "UNREAD",
        userType: "staff",
        userId: user.id,
        type: "internal",
        content: {
          data: {
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
        await axiosXanoStaff.put(
          `/messages/${message.id}`,
          {
            ...message,
            deleted_by_staff_ids: [...message.deleted_by_staff_ids, user.id],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        socket.emit("message", {
          route: "MESSAGES INBOX",
          action: "update",
          content: {
            id: message.id,
            data: {
              ...message,
              deleted_by_staff_ids: [...message.deleted_by_staff_ids, user.id],
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
        message.to_staff_ids.includes(user.id) &&
        !message.read_by_staff_ids.includes(user.id)
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
      <div onClick={handleMsgClick} className="message-thumbnail__link">
        <div className="message-thumbnail__author">
          {section !== "Sent messages"
            ? staffIdToTitleAndName(clinic.staffInfos, message.from_id, true)
            : staffIdListToTitleAndName(
                clinic.staffInfos,
                message.to_staff_ids
              )}
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
        {patient && (
          <NavLink
            to={`/patient-record/${patient.patient_id}`}
            className="message-thumbnail__patient-link"
            target="_blank"
          >
            {patientIdToName(clinic.demographicsInfos, patient.patient_id)}
          </NavLink>
        )}
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
