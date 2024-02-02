import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDateAndTimeWithSeconds } from "../../../../utils/formatDates";
import { patientIdToName } from "../../../../utils/patientIdToName";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import MessagesAttachments from "../MessagesAttachments";
import ForwardMessageExternal from "./ForwardMessageExternal";
import MessageExternal from "./MessageExternal";
import MessagesExternalPrintPU from "./MessagesExternalPrintPU";
import ReplyMessageExternal from "./ReplyMessageExternal";

const MessageExternalDetail = ({
  setCurrentMsgId,
  message,
  section,
  popUpVisible,
  setPopUpVisible,
}) => {
  const [replyVisible, setReplyVisible] = useState(false);
  const [forwardVisible, setForwardVisible] = useState(false);
  const [allPersons, setAllPersons] = useState(false);
  const { auth, user, clinic, socket } = useAuth();
  const [previousMsgs, setPreviousMsgs] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const messageContentRef = useRef(null);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchPreviousMsgs = async () => {
      try {
        const response = await axiosXanoStaff.post(
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
  }, [auth.authToken, message.previous_messages_ids]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAttachments = async () => {
      try {
        const response = (
          await axiosXanoStaff.post(
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

  const handleClickForward = (e) => {
    setForwardVisible(true);
  };

  const handleDeleteMsg = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this message ?",
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
          route: " EXTERNAL",
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
    setAllPersons(false);
  };

  const handleAddToClinicalNotes = async () => {
    //create the attachment with message content
    const element = messageContentRef.current;
    const newContent = element.cloneNode(true);
    newContent.style.width = "210mm";
    window.document.body.append(newContent);
    const canvas = await html2canvas(newContent, {
      letterRendering: 1,
      useCORS: true,
    });
    window.document.body.removeChild(newContent);
    const dataURL = canvas.toDataURL("image/png");
    let fileToUpload = await axiosXanoStaff.post(
      "/upload/attachment",
      {
        content: dataURL,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      }
    );
    //post attachment and get id
    const datasAttachment = [
      {
        file: fileToUpload.data,
        alias: `Message from: ${staffIdToTitleAndName(
          clinic.staffInfos,
          message.from_id,
          true
        )} (${toLocalDateAndTimeWithSeconds(new Date(message.date_created))})`,
        date_created: Date.now(),
        created_by_id: user.id,
        created_by_user_type: "staff",
      },
    ];

    try {
      const attach_ids = (
        await postPatientRecord("/attachments", user.id, auth.authToken, {
          attachments_array: datasAttachment,
        })
      ).data;
      await postPatientRecord(
        "/progress_notes",
        user.id,
        auth.authToken,
        {
          patient_id:
            message.from_user_type === "patient"
              ? message.from_id
              : message.to_id,
          object: `Message from: ${
            message.from_user_type === "patient"
              ? patientIdToName(clinic.demographicsInfos, message.from_id)
              : staffIdToTitleAndName(clinic.staffInfos, message.from_id, true)
          } (${toLocalDateAndTimeWithSeconds(new Date(message.date_created))})`,
          body: "See attachment",
          version_nbr: 1,
          attachments_ids: attach_ids,
        },
        socket,
        "PROGRESS NOTES"
      );
      toast.success("Message successfuly added to patient progress notes", {
        containerId: "A",
      });
    } catch (err) {
      toast.error(
        `Unable to add message to patient progress notes: ${err.message}`,
        {
          containerId: "A",
        }
      );
    }
  };

  const handleAddAllAttachments = async () => {
    try {
      for (const attachment of attachments) {
        const response = await postPatientRecord(
          "/documents",
          user.id,
          auth.authToken,
          {
            patient_id: message.related_patient_id,
            assigned_id: user.id,
            description: attachment.alias,
            file: attachment.file,
          }
        );
        socket.emit("message", {
          route: "DOCUMENTS",
          action: "create",
          content: { data: response.data },
        });
        socket.emit("message", {
          route: "DOCMAILBOX",
          action: "create",
          content: { data: response.data },
        });
      }
      toast.success("Attachments added successfully", { containerId: "A" });
    } catch (err) {
      toast.error(`Error unable to addattachments: ${err.message}`, {
        containerId: "A",
      });
    }
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
        <div className="message-detail__patient">
          <NavLink
            to={`/staff/patient-record/${
              message.from_user_type === "patient"
                ? message.from_id
                : message.to_id
            }`}
            target="_blank"
            className="message-detail__patient-link"
          >
            {message.from_user_type === "patient"
              ? patientIdToName(clinic.demographicsInfos, message.from_id)
              : patientIdToName(clinic.demographicsInfos, message.to_id)}
          </NavLink>
          <button onClick={handleAddToClinicalNotes}>
            Add message to patient clinical notes
          </button>
        </div>
        {section !== "Deleted messages" && (
          <i
            className="fa-solid fa-trash  message-detail__trash"
            onClick={handleDeleteMsg}
          ></i>
        )}
      </div>
      <div className="message-detail__content" ref={messageContentRef}>
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
          addable={true}
          patientId={
            message.from_user_type === "patient"
              ? message.from_id
              : message.to_id
          }
        />
      </div>
      {replyVisible && (
        <ReplyMessageExternal
          setReplyVisible={setReplyVisible}
          allPersons={allPersons}
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
          <button onClick={handleClickForward}>Forward</button>
          {/* {message.related_patient_id ? (
            <button
              onClick={handleAddAllAttachments}
              disabled={attachments.length === 0}
            >
              Add all attachments to patient record
            </button>
          ) : null} */}
        </div>
      )}
      {forwardVisible && (
        <FakeWindow
          title="FORWARD MESSAGE"
          width={1000}
          height={600}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 600) / 2}
          color={"#94bae8"}
          setPopUpVisible={setForwardVisible}
        >
          <ForwardMessageExternal
            setForwardVisible={setForwardVisible}
            message={message}
            previousMsgs={previousMsgs}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default MessageExternalDetail;
