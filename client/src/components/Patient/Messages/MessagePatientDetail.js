import React, { useEffect, useState } from "react";
import NewWindow from "react-new-window";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { toPatientName } from "../../../utils/names/toPatientName";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import MessageExternal from "../../Staff/Messaging/External/MessageExternal";
import MessagesExternalPrintPU from "../../Staff/Messaging/External/MessagesExternalPrintPU";
import MessagesAttachments from "../../Staff/Messaging/MessagesAttachments";
import ReplyMessagePatient from "./ReplyMessagePatient";

const MessagePatientDetail = ({
  setCurrentMsgId,
  message,
  section,
  popUpVisible,
  setPopUpVisible,
  setMessages,
  setPaging,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [replyVisible, setReplyVisible] = useState(false);
  const [previousMsgs, setPreviousMsgs] = useState([]);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    setPreviousMsgs(
      message.previous_messages_ids
        .map(({ previous_message }) => previous_message)
        .sort((a, b) => b.date_created - a.date_created)
    );
    setAttachments(message.attachments_ids.map(({ attachment }) => attachment));
  }, [message.attachments_ids, message.previous_messages_ids, setPreviousMsgs]);

  const handleClickBack = (e) => {
    setCurrentMsgId(0);
    setMessages([]);
    setPaging((p) => {
      return { ...p, page: 1 };
    });
  };

  const handleDeleteMsg = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this message ?",
      })
    ) {
      try {
        const datasToPut = {
          ...message,
          deleted_by_patient_id: user.id,
          attachments_ids: message.attachments_ids.map(
            ({ attachment }) => attachment.id
          ),
          previous_messages_ids: message.previous_messages_ids.map(
            ({ previous_message }) => previous_message.id
          ),
        };
        delete datasToPut.to_patient_infos;
        delete datasToPut.form_patient_infos;
        const response = await xanoPut(
          `/messages_external/${message.id}`,
          "patient",
          datasToPut
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
        setCurrentMsgId(0);
        setMessages([]);
        setPaging((p) => {
          return { ...p, page: 1 };
        });
        toast.success("Message deleted successfully", { containerId: "A" });
      } catch (err) {
        toast.error(`Error: unable to delete message: ${err.message}`, {
          containerId: "A",
        });
      }
    }
  };

  const handleClickReply = (e) => {
    setReplyVisible(true);
  };

  return (
    message && (
      <>
        {popUpVisible && (
          <NewWindow
            title={`Message(s) / Subject: ${message.subject}`}
            features={{
              toolbar: "no",
              scrollbars: "no",
              menubar: "no",
              status: "no",
              directories: "no",
              width: 793.7,
              height: 1122.5,
              left: 320,
              top: 200,
            }}
            onUnload={() => setPopUpVisible(false)}
          >
            <MessagesExternalPrintPU
              message={message}
              previousMsgs={previousMsgs}
              attachments={attachments}
            />
          </NewWindow>
        )}
        <div className="message-detail__toolbar">
          <i
            className="fa-solid fa-arrow-left message-detail__arrow"
            style={{ cursor: "pointer" }}
            onClick={handleClickBack}
          ></i>
          <div className="message-detail__subject">{message.subject}</div>
          {section !== "Deleted messages" && (
            <i
              className="fa-solid fa-trash  message-detail__trash"
              onClick={handleDeleteMsg}
            ></i>
          )}
        </div>
        <div className="message-detail__content">
          <MessageExternal message={message} key={message.id} index={0} />
          {previousMsgs &&
            previousMsgs.length > 0 &&
            previousMsgs.map((message, index) => (
              <MessageExternal
                message={message}
                key={message.id}
                index={index + 1}
              />
            ))}
          <MessagesAttachments
            attachments={attachments}
            deletable={false}
            cardWidth="15%"
            addable={false}
            patientId={message.from_patient_id || message.to_patient_id}
            patientName={
              message.from_patient_id
                ? toPatientName(message.from_patient_infos)
                : toPatientName(message.to_patient_infos)
            }
            message={message}
          />
        </div>
        {replyVisible && (
          <ReplyMessagePatient
            setReplyVisible={setReplyVisible}
            message={message}
            previousMsgs={previousMsgs}
            setCurrentMsgId={setCurrentMsgId}
            setMessages={setMessages}
            setPaging={setPaging}
          />
        )}
        {section !== "Deleted messages" && !replyVisible && (
          <div className="message-detail__btns">
            {section !== "Sent messages" && (
              <button onClick={handleClickReply}>Reply</button>
            )}
          </div>
        )}
      </>
    )
  );
};

export default MessagePatientDetail;
