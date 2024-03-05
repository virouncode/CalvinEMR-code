import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useFetchPreviousMessages from "../../../../hooks/useFetchPreviousMessages";
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
import CircularProgressSmallWhite from "../../../All/UI/Progress/CircularProgressSmallWhite";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
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
}) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const messageContentRef = useRef(null);
  const [replyVisible, setReplyVisible] = useState(false);
  const [forwardVisible, setForwardVisible] = useState(false);
  const [allPersons, setAllPersons] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [posting, setPosting] = useState(false);

  const [previousMsgs, setPreviousMsgs] = useFetchPreviousMessages(message);
  useEffect(() => {
    setAttachments(message.attachments_ids.map(({ attachment }) => attachment));
  }, [message.attachments_ids, message.previous_messages]);

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
        const datasToPut = {
          ...message,
          deleted_by_staff_ids: [...message.deleted_by_staff_ids, user.id],
          attachments_ids: message.attachments_ids.map(
            ({ attachment }) => attachment.id
          ),
          previous_messages: message.previous_messages
            .filter((item) => item)
            .map((item) => {
              return { message_type: item.message_type, id: item.id };
            }),
        };
        delete datasToPut.patient_infos;
        const response = await axiosXanoStaff.put(
          `/messages/${message.id}`,
          datasToPut,
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
            staffInfos,
            message.from_id,
            true
          )} (${toLocalDateAndTimeWithSeconds(
            new Date(message.date_created)
          )})`,
          date_created: Date.now(),
          created_by_id: user.id,
          created_by_user_type: "staff",
        },
      ];

      const attach_ids = (
        await postPatientRecord("/attachments", user.id, auth.authToken, {
          attachments_array: datasAttachment,
        })
      ).data;
      await postPatientRecord(
        "/clinical_notes",
        user.id,
        auth.authToken,
        {
          patient_id: message.related_patient_id,
          subject: `Message from ${staffIdToTitleAndName(
            staffInfos,
            message.from_id,
            true
          )} (${toLocalDateAndTimeWithSeconds(
            new Date(message.date_created)
          )})`,
          MyClinicalNotesContent: "See attachment",
          ParticipatingProviders: [
            {
              Name: {
                FirstName: staffIdToFirstName(staffInfos, message.from_id),
                LastName: staffIdToLastName(staffInfos, message.from_id),
              },
              OHIPPhysicianId: staffIdToOHIP((staffInfos, message.from_id)),
              DateTimeNoteCreated: Date.now(),
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
  //         auth.authToken,
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
                <NavLink
                  to={`/staff/patient-record/${message.related_patient_id}`}
                  className="message-detail__patient-link"
                  target="_blank"
                >
                  {toPatientName(message.patient_infos)}
                </NavLink>
                <button
                  onClick={handleAddToClinicalNotes}
                  style={{ width: "230px" }}
                >
                  {posting ? (
                    <CircularProgressSmallWhite />
                  ) : (
                    "Add message to patient clinical notes"
                  )}
                </button>
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
          <Message message={message} key={message.id} index={0} />
          {previousMsgs &&
            previousMsgs.length > 0 &&
            previousMsgs.map((message, index) =>
              message.type === "Internal" ? (
                <Message message={message} key={message.id} index={index + 1} />
              ) : (
                <MessageExternal
                  message={message}
                  key={message.id}
                  index={index + 1}
                />
              )
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
          />
        )}
        {section !== "Deleted messages" && !replyVisible && !forwardVisible && (
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
