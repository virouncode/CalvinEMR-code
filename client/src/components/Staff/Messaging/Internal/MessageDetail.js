import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDateAndTimeWithSeconds } from "../../../../utils/formatDates";
import { patientIdToName } from "../../../../utils/patientIdToName";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";
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
  const messageContentRef = useRef(null);
  const [replyVisible, setReplyVisible] = useState(false);
  const [forwardVisible, setForwardVisible] = useState(false);
  const [allPersons, setAllPersons] = useState(false);
  const { auth, user, clinic, socket } = useAuth();
  const [previousMsgs, setPreviousMsgs] = useState(null);
  const patient = clinic.demographicsInfos.find(
    ({ patient_id }) => patient_id === message?.related_patient_id
  );
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchPreviousMsgs = async () => {
      try {
        //Previous Internal messages
        const response = await axiosXanoStaff.post(
          "/messages_selected",
          {
            messages_ids: message.previous_messages
              .filter((previousMsg) => previousMsg.message_type === "Internal")
              .map((message) => message.id),
          },
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
              "Content-Type": "application/json",
            },
            signal: abortController.signal,
          }
        );
        //Previous External Messages
        const response2 = await axiosXanoStaff.post(
          "/messages_external_selected",
          {
            messages_ids: message.previous_messages
              .filter((previousMsg) => previousMsg.message_type === "External")
              .map((message) => message.id),
          },
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
          [...response.data, ...response2.data].sort(
            (a, b) => b.date_created - a.date_created
          )
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
  }, [auth.authToken, message.id, message.previous_messages]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAttachments = async () => {
      try {
        const response = (
          await axiosXanoStaff.post(
            "/attachments_for_message",
            { attachments_ids: message?.attachments_ids },
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
  }, [auth.authToken, message?.attachments_ids]);

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
        // content: pdf.output("dataurlstring"),
        content: dataURL,
      },
      {
        headers: {
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
        "/clinical_notes",
        user.id,
        auth.authToken,
        {
          patient_id: message.related_patient_id,
          subject: `Message from ${staffIdToTitleAndName(
            clinic.staffInfos,
            message.from_id,
            true
          )} (${toLocalDateAndTimeWithSeconds(
            new Date(message.date_created)
          )})`,
          MyClinicalNotesContent: "See attachment",
          ParticipatingProviders: [
            {
              Name: {
                FirstName: staffIdToFirstName(
                  clinic.staffInfos,
                  message.from_id
                ),
                LastName: staffIdToLastName(clinic.staffInfos, message.from_id),
              },
              OHIPPhysicianId: staffIdToOHIP(
                (clinic.staffInfos, message.from_id)
              ),
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
    } catch (err) {
      toast.error(
        `Unable to add message to patient clinical notes: ${err.message}`,
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
          },
          socket,
          "DOCUMENTS"
        );
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
    message && (
      <>
        {popUpVisible && (
          <NewWindow
            title={`Message(s) / Subject: ${message.subject} ${
              message.related_patient_id &&
              `/ Patient: ${patientIdToName(
                clinic.demographicsInfos,
                message.related_patient_id
              )}`
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
            {patient && (
              <>
                <NavLink
                  to={`/staff/patient-record/${patient.id}`}
                  className="message-detail__patient-link"
                  target="_blank"
                >
                  {patient.full_name}
                </NavLink>
                <button onClick={handleAddToClinicalNotes}>
                  Add message to patient clinical notes
                </button>
              </>
            )}
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
            addable={patient ? true : false}
            patientId={patient ? patient.id : null}
          />
        </div>
        {replyVisible && (
          <ReplyMessage
            setReplyVisible={setReplyVisible}
            allPersons={allPersons}
            message={message}
            previousMsgs={previousMsgs}
            patient={patient}
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
              patient={patient}
            />
          </FakeWindow>
        )}
      </>
    )
  );
};

export default MessageDetail;
