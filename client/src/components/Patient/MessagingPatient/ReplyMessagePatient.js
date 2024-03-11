import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";
import ToastCalvin from "../../All/UI/Toast/ToastCalvin";
import MessageExternal from "../../Staff/Messaging/External/MessageExternal";
import MessagesAttachments from "../../Staff/Messaging/MessagesAttachments";

const ReplyMessagePatient = ({
  setReplyVisible,
  message,
  previousMsgs,
  setCurrentMsgId,
}) => {
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
          "patient",

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
        from_patient_id: user.id,
        to_staff_id: message.from_staff_id,
        subject: previousMsgs.length
          ? `Re: ${message.subject.slice(message.subject.indexOf(":") + 1)}`
          : `Re: ${message.subject}`,
        body: body,
        attachments_ids: attach_ids,
        read_by_patient_id: user.id,
        previous_messages_ids: [
          ...previousMsgs.map(({ id }) => id),
          message.id,
        ],
        date_created: Date.now(),
      };
      const response = await xanoPost(
        "/messages_external",
        "patient",

        replyMessage
      );
      socket.emit("message", {
        route: "MESSAGES INBOX EXTERNAL",
        action: "create",
        content: { data: response.data },
      });
      socket.emit("message", {
        route: "MESSAGES WITH PATIENT",
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
          const response = await xanoPost(
            "/upload/attachment",
            "patient",

            { content }
          );
          if (!response.data.type) response.data.type = "document";
          setAttachments([
            ...attachments,
            {
              file: response.data,
              alias: file.name,
              date_created: Date.now(),
              created_by_id: user.id,
              created_by_user_type: "patient",
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
          {staffIdToTitleAndName(staffInfos, message.from_staff_id)}
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
      <div className="reply-message__attach">
        <strong>Attach files</strong>
        <i className="fa-solid fa-paperclip" onClick={handleAttach}></i>
        {attachments.map((attachment) => (
          <span key={attachment.file.name} style={{ marginLeft: "5px" }}>
            {attachment.alias},
          </span>
        ))}
      </div>
      <div className="reply-message__body">
        <textarea value={body} onChange={handleChange}></textarea>
        <div className="reply-message__history">
          <MessageExternal message={message} key={message.id} index={0} />
          {previousMsgs.map((message, index) => (
            <MessageExternal
              message={message}
              key={message.id}
              index={index + 1}
            />
          ))}
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

export default ReplyMessagePatient;
