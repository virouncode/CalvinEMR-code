import React, { useEffect, useState } from "react";
import NewWindow from "react-new-window";
import { toast } from "react-toastify";
import { axiosXanoPatient } from "../../../api/xanoPatient";
import useAuth from "../../../hooks/useAuth";
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
}) => {
  const [replyVisible, setReplyVisible] = useState(false);
  const { auth, user, socket } = useAuth();
  const [previousMsgs, setPreviousMsgs] = useState(null);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchPreviousMsgs = async () => {
      try {
        const response = await axiosXanoPatient.post(
          "/messages_external_selected",
          { messages_ids: message.previous_messages_ids },
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
              "Content-Type": "application/json",
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setPreviousMsgs(
          response.data.sort((a, b) => b.date_created - a.date_created)
        );
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(
            `Error: unable to fetch previous messages: ${err.message}`,
            { containerId: "A" }
          );
      }
    };
    fetchPreviousMsgs();
    return () => abortController.abort();
  }, [auth.authToken, user.id, message.previous_messages_ids]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAttachments = async () => {
      try {
        const response = (
          await axiosXanoPatient.post(
            "/attachments_for_message",
            { attachments_ids: message.attachments_ids },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.authToken}`,
              },
              signal: abortController.signal,
            }
          )
        ).data;
        if (abortController.signal.aborted) return;
        setAttachments(response);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to fetch attachments: ${err.message}`, {
            containerId: "A",
          });
      }
    };
    fetchAttachments();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken, message.attachments_ids]);

  const handleClickBack = (e) => {
    setCurrentMsgId(0);
  };

  const handleDeleteMsg = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this message ?",
      })
    ) {
      try {
        await axiosXanoPatient.put(
          `/messages_external/${message.id}`,
          {
            ...message,
            deleted_by_patient_id: user.id,
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
        setCurrentMsgId(0);
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
        />
      </div>
      {replyVisible && (
        <ReplyMessagePatient
          setReplyVisible={setReplyVisible}
          message={message}
          previousMsgs={previousMsgs}
          setCurrentMsgId={setCurrentMsgId}
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
  );
};

export default MessagePatientDetail;
