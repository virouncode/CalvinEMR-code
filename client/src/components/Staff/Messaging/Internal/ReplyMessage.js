import { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../../api/xanoPost";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useSocketContext from "../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import CircularProgressMedium from "../../../All/UI/Progress/CircularProgressMedium";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import MessagesAttachments from "../MessagesAttachments";
import Message from "./Message";

const ReplyMessage = ({
  setReplyVisible,
  allPersons,
  message,
  previousMsgs,
  patientName,
  setCurrentMsgId,
}) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);

  const handleCancel = (e) => {
    setReplyVisible(false);
  };
  const handleSend = async (e) => {
    try {
      setProgress(true);
      let attach_ids;

      if (attachments.length > 0) {
        const response = await xanoPost(
          "/messages_attachments",
          axiosXanoStaff,
          auth.authToken,
          {
            attachments_array: attachments,
          }
        );
        attach_ids = [
          ...message.attachments_ids.map(({ attachment }) => attachment.id),
          ...response.data,
        ];
      } else {
        attach_ids = [
          ...message.attachments_ids.map(({ attachment }) => attachment.id),
        ];
      }

      const replyMessage = {
        from_id: user.id,
        to_staff_ids: allPersons
          ? [...new Set([...message.to_staff_ids, message.from_id])].filter(
              (id) => id !== user.id
            )
          : [message.from_id],
        subject: previousMsgs.length
          ? `Re: ${message.subject.slice(message.subject.indexOf(":") + 1)}`
          : `Re: ${message.subject}`,
        body: body,
        attachments_ids: attach_ids,
        related_patient_id: message.related_patient_id || 0,
        read_by_staff_ids: [user.id],
        previous_messages: [
          ...message.previous_messages,
          { message_type: "Internal", id: message.id },
        ],
        date_created: Date.now(),
        type: "Internal",
      };

      const response = await axiosXanoStaff.post("/messages", replyMessage, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      socket.emit("message", {
        route: "MESSAGES INBOX",
        action: "create",
        content: { data: response.data },
      });
      socket.emit("message", {
        route: "MESSAGES ABOUT PATIENT",
        action: "create",
        content: { data: response.data },
      });
      setReplyVisible(false);
      setCurrentMsgId(0);
      toast.success("Message sent successfully", { containerId: "A" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error: unable to send message: ${err.message}`, {
        containerId: "B",
      });
      setProgress(false);
    }
  };

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleAttach = (e) => {
    let input = e.nativeEvent.view.document.createElement("input");
    input.type = "file";
    input.accept =
      ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx";
    input.onchange = (e) => {
      // getting a hold of the file reference
      let file = e.target.files[0];
      if (file.size > 25000000) {
        toast.error(
          "The file is over 25Mb, please choose another one or send a link",
          { containerId: "B" }
        );
        return;
      }
      setIsLoadingFile(true);
      // setting up the reader`
      let reader = new FileReader();
      reader.readAsDataURL(file);
      // here we tell the reader what to do when it's done reading...
      reader.onload = async (e) => {
        let content = e.target.result; // this is the content!
        try {
          const response = await axiosXanoStaff.post(
            "/upload/attachment",
            {
              content: content,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.authToken}`,
              },
            }
          );
          if (!response.data.type) response.data.type = "document";
          setAttachments([
            ...attachments,
            {
              file: response.data,
              alias: file.name,
              date_created: Date.now(),
              created_by_id: user.id,
              created_by_user_type: "staff",
            },
          ]); //meta, mime, name, path, size, type
          setIsLoadingFile(false);
        } catch (err) {
          toast.error(`Error: unable to load file: ${err.message}`, {
            containerId: "A",
          });
          setIsLoadingFile(false);
        }
      };
    };
    input.click();
  };

  const handleRemoveAttachment = (fileName) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  return (
    <div className="reply-message__form">
      <div className="reply-message__title">
        <p>
          <strong>To: </strong>
          {allPersons
            ? [...new Set([...message.to_staff_ids, message.from_id])]
                .filter((staffId) => staffId !== user.id)
                .map((staffId) =>
                  staffIdToTitleAndName(staffInfos, staffId, true)
                )
                .join(", ")
            : staffIdToTitleAndName(staffInfos, message.from_id, true)}
        </p>
      </div>
      <div className="reply-message__subject">
        <strong>Subject:</strong>
        {previousMsgs.length
          ? `\u00A0Re: ${message.subject.slice(
              message.subject.indexOf(":") + 1
            )}`
          : `\u00A0Re: ${message.subject}`}
      </div>

      {patientName && (
        <div className="reply-message__patient">
          <strong>About patient:</strong> {"\u00A0" + patientName}
        </div>
      )}
      <div className="reply-message__attach">
        <strong>Attach files</strong>
        <i
          className="fa-solid fa-paperclip"
          onClick={handleAttach}
          disabled={progress || isLoadingFile}
        ></i>
        {attachments.map((attachment) => (
          <span key={attachment.file.name} style={{ marginLeft: "5px" }}>
            {attachment.alias},
          </span>
        ))}
      </div>
      <div className="reply-message__body">
        <textarea
          value={body}
          onChange={handleChange}
          id="body-area"
        ></textarea>
        <div className="reply-message__history">
          <Message message={message} key={message.id} index={0} />
          {previousMsgs.map((message, index) =>
            message.type === "Internal" ? (
              <Message message={message} key={message.id} index={index + 1} />
            ) : (
              <Message message={message} key={message.id} index={index + 1} />
            )
          )}
        </div>
        <MessagesAttachments
          attachments={attachments}
          handleRemoveAttachment={handleRemoveAttachment}
          deletable={true}
          cardWidth="17%"
          addable={false}
        />
      </div>
      <div className="reply-message__btns">
        <button onClick={handleSend} disabled={isLoadingFile || progress}>
          Send
        </button>
        <button onClick={handleCancel} disabled={progress}>
          Cancel
        </button>
        {isLoadingFile && <CircularProgressMedium />}
      </div>
      <ToastCalvin id="B" />
    </div>
  );
};

export default ReplyMessage;
