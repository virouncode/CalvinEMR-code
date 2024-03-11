import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import { postPatientRecord } from "../../../../api/fetchRecords";
import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";
import { toLocalDateAndTimeWithSeconds } from "../../../../utils/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/toPatientName";
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
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [replyVisible, setReplyVisible] = useState(false);
  const [forwardVisible, setForwardVisible] = useState(false);
  const [allPersons, setAllPersons] = useState(false);
  const messageContentRef = useRef(null);
  const [previousMsgs, setPreviousMsgs] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [posting, setPosting] = useState(false);

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
        const datasToPut = {
          ...message,
          deleted_by_staff_id: user.id,
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
          "staff",
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
    try {
      setPosting(true);
      //create the attachment with message content
      const element = messageContentRef.current;
      const canvas = await html2canvas(element, {
        useCORS: true,
      });
      const dataURL = canvas.toDataURL("image/jpeg");
      let fileToUpload = await xanoPost(
        "/upload/attachment",
        "staff",

        { content: dataURL }
      );

      //post attachment and get id
      const datasAttachment = [
        {
          file: fileToUpload.data,
          alias: `Message from: ${
            message.from_staff_id
              ? staffIdToTitleAndName(staffInfos, message.from_staff_id)
              : toPatientName(message.from_patient_infos)
          } (${toLocalDateAndTimeWithSeconds(new Date(message.date_created))})`,
          date_created: Date.now(),
          created_by_id: user.id,
          created_by_user_type: "staff",
        },
      ];

      const attach_ids = (
        await postPatientRecord(
          "/clinical_notes_attachments",
          user.id,

          {
            attachments_array: datasAttachment,
          }
        )
      ).data;
      await postPatientRecord(
        "/clinical_notes",
        user.id,

        {
          patient_id: message.from_patient_id || message.to_patient_id,
          subject: `Message from: ${
            message.from_patient_id
              ? toPatientName(message.from_patient_infos)
              : staffIdToTitleAndName(staffInfos, message.from_staff_id)
          } (${toLocalDateAndTimeWithSeconds(new Date(message.date_created))})`,
          MyClinicalNotesContent: "See attachment",
          ParticipatingProviders: [
            {
              Name: {
                FirstName: staffIdToFirstName(staffInfos, user.id),
                LastName: staffIdToLastName(staffInfos, user.id),
              },
              OHIPPhysicianId: staffIdToOHIP(staffInfos, user.id),
              DateTimeNoteCreated: Date.now(),
            },
          ],
          version_nbr: 1,
          attachments_ids: attach_ids,
        },
        socket,
        "CLINICAL NOTES"
      );
      toast.success("Message successfuly added to patient clinical notes", {
        containerId: "A",
      });
      setPosting(false);
    } catch (err) {
      toast.error(
        `Unable to add message to patient clinical notes: ${err.message}`,
        {
          containerId: "A",
        }
      );
      setPosting(false);
    }
  };

  // const handleAddAllAttachments = async () => {
  //   try {
  //     for (const attachment of attachments) {
  //       const response = await postPatientRecord(
  //         "/documents",
  //         user.id,
  //
  //         {
  //           patient_id: message.related_patient_id,
  //           assigned_id: user.id,
  //           description: attachment.alias,
  //           file: attachment.file,
  //         }
  //       );
  //       socket.emit("message", {
  //         route: "DOCUMENTS",
  //         action: "create",
  //         content: { data: response.data },
  //       });
  //       socket.emit("message", {
  //         route: "REPORTS INBOX",
  //         action: "create",
  //         content: { data: response.data },
  //       });
  //     }
  //     toast.success("Attachments added successfully", { containerId: "A" });
  //   } catch (err) {
  //     toast.error(`Error unable to addattachments: ${err.message}`, {
  //       containerId: "A",
  //     });
  //   }
  // };

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
          <div className="message-detail__patient">
            <NavLink
              to={`/staff/patient-record/${
                message.from_patient_id || message.to_patient_id
              }`}
              // target="_blank"
              className="message-detail__patient-link"
            >
              {message.from_patient_id
                ? toPatientName(message.from_patient_infos)
                : toPatientName(message.to_patient_infos)}
            </NavLink>
            <button onClick={handleAddToClinicalNotes} disabled={posting}>
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
            addable={true}
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
              patientName={
                message.from_patient_id
                  ? toPatientName(message.from_patient_infos)
                  : toPatientName(message.to_patient_infos)
              }
            />
          </FakeWindow>
        )}
      </>
    )
  );
};

export default MessageExternalDetail;
