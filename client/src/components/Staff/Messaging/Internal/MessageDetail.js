import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import { postPatientRecord } from "../../../../api/fetchRecords";
import xanoDelete from "../../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import useFetchPreviousMessages from "../../../../hooks/useFetchPreviousMessages";
import {
  nowTZTimestamp,
  timestampToDateTimeSecondsStrTZ,
} from "../../../../utils/dates/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../utils/names/staffIdToName";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessageExternal from "../External/MessageExternal";
import MessagesAttachments from "../MessagesAttachments";
import ForwardMessage from "./ForwardMessage";
import Message from "./Message";
import MessagesPrintPU from "./MessagesPrintPU";
import ReplyMessage from "./ReplyMessage";

const MessageDetail = ({
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
  const { staffInfos } = useStaffInfosContext();
  const messageContentRef = useRef(null);
  const [replyVisible, setReplyVisible] = useState(false);
  const [forwardVisible, setForwardVisible] = useState(false);
  const [allPersons, setAllPersons] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [posting, setPosting] = useState(false);
  const [previousMsgs, loading, errMsg] = useFetchPreviousMessages(
    message,
    section
  );
  useEffect(() => {
    if (!message) return;
    setAttachments(message.attachments_ids.map(({ attachment }) => attachment));
  }, [message]);

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
          setCurrentMsgId(0);
          setMessages([]);
          setPaging((p) => {
            return { ...p, page: 1 };
          });
          toast.success("To-do deleted successfully", { containerId: "A" });
        } else {
          const datasToPut = {
            ...message,
            deleted_by_staff_ids: [...message.deleted_by_staff_ids, user.id],
            attachments_ids: message.attachments_ids.map(
              ({ attachment }) => attachment.id
            ), //reformatted because of add-on
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

          setCurrentMsgId(0);
          setMessages([]);
          setPaging((p) => {
            return { ...p, page: 1 };
          });
          toast.success("Message deleted successfully", { containerId: "A" });
        }
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
  const handleClickReplyAll = (e) => {
    setReplyVisible(true);
    setAllPersons(true);
  };

  const handleClickForward = (e) => {
    setForwardVisible(true);
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
          alias: `Message from: ${staffIdToTitleAndName(
            staffInfos,
            message.from_id
          )} (${timestampToDateTimeSecondsStrTZ(message.date_created)})`,
        },
      ];

      const attach_ids = (
        await postPatientRecord("/clinical_notes_attachments", user.id, {
          attachments_array: datasAttachment,
        })
      ).data;
      await postPatientRecord(
        "/clinical_notes",
        user.id,

        {
          patient_id: message.related_patient_id,
          subject: `Message from ${staffIdToTitleAndName(
            staffInfos,
            message.from_id
          )} (${timestampToDateTimeSecondsStrTZ(message.date_created)})`,
          MyClinicalNotesContent: "See attachment",
          ParticipatingProviders: [
            {
              Name: {
                FirstName: staffIdToFirstName(staffInfos, user.id),
                LastName: staffIdToLastName(staffInfos, user.id),
              },
              OHIPPhysicianId: staffIdToOHIP((staffInfos, user.id)),
              DateTimeNoteCreated: nowTZTimestamp(),
            },
          ],
          version_nbr: 1,
          attachments_ids: attach_ids,
        },
        socket,
        "CLINICAL NOTES"
      );
      setPosting(false);
      toast.success("Message successfuly added to patient clinical notes", {
        containerId: "A",
      });
    } catch (err) {
      setPosting(false);
      toast.error(
        `Unable to add message to patient clinical notes: ${err.message}`,
        {
          containerId: "A",
        }
      );
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
  //         },
  //         socket,
  //         "DOCUMENTS"
  //       );
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
            title={`Message(s) / Subject: ${message.subject} ${
              message.related_patient_id
                ? `/ Patient: ${toPatientName(message.patient_infos)}`
                : ""
            }`}
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
            <MessagesPrintPU
              message={message}
              previousMsgs={previousMsgs}
              attachments={attachments}
              section={section}
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
            {message.related_patient_id ? (
              <>
                <span>
                  <strong>Related patient: </strong>
                </span>
                <NavLink
                  to={`/staff/patient-record/${message.related_patient_id}`}
                  className="message-detail__patient-link"
                  target="_blank"
                >
                  {toPatientName(message.patient_infos)}
                </NavLink>
                {section !== "To-dos" && (
                  <button
                    onClick={handleAddToClinicalNotes}
                    style={{ width: "230px" }}
                    disabled={posting}
                  >
                    Add message to patient clinical notes
                  </button>
                )}
              </>
            ) : null}
          </div>
          {section !== "Deleted messages" && (
            <i
              className="fa-solid fa-trash  message-detail__trash"
              onClick={handleDeleteMsg}
            ></i>
          )}
        </div>
        <div ref={messageContentRef} className="message-detail__content">
          <Message
            message={message}
            key={message.id}
            index={0}
            section={section}
          />
          {section !== "To-dos" && (
            <>
              {errMsg && (
                <p className="message-detail__content-err">{errMsg}</p>
              )}
              {!errMsg && previousMsgs && previousMsgs.length > 0
                ? previousMsgs.map((message, index) =>
                    message.type === "Internal" ? (
                      <Message
                        message={message}
                        key={message.id}
                        index={index + 1}
                      />
                    ) : (
                      <MessageExternal
                        message={message}
                        key={message.id}
                        index={index + 1}
                      />
                    )
                  )
                : !loading && null}
              {loading && <LoadingParagraph />}
            </>
          )}
          <MessagesAttachments
            attachments={attachments}
            deletable={false}
            cardWidth="15%"
            addable={message.related_patient_id ? true : false}
            patientId={
              message.related_patient_id ? message.related_patient_id : null
            }
            patientName={toPatientName(message.patient_infos)}
            message={message}
          />
        </div>
        {replyVisible && (
          <ReplyMessage
            setReplyVisible={setReplyVisible}
            allPersons={allPersons}
            message={message}
            previousMsgs={previousMsgs}
            patientName={toPatientName(message.patient_infos)}
            setCurrentMsgId={setCurrentMsgId}
            setMessages={setMessages}
            setPaging={setPaging}
          />
        )}
        {section !== "Deleted messages" &&
          section !== "To-dos" &&
          !replyVisible &&
          !forwardVisible && (
            <div className="message-detail__btns">
              {section !== "Sent messages" && (
                <button onClick={handleClickReply}>Reply</button>
              )}
              {message.to_staff_ids.length >= 2 &&
                section !== "Sent messages" && (
                  <button onClick={handleClickReplyAll}>Reply all</button>
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
            <ForwardMessage
              setForwardVisible={setForwardVisible}
              message={message}
              previousMsgs={previousMsgs}
              patientName={toPatientName(message.patient_infos)}
            />
          </FakeWindow>
        )}
      </>
    )
  );
};

export default MessageDetail;
