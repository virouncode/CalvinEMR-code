import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";
import ToastCalvin from "../../All/UI/Toast/ToastCalvin";
import MessagesAttachments from "../../Staff/Messaging/MessagesAttachments";
import ContactsForPatient from "./ContactsForPatient";

const NewMessagePatient = ({ setNewVisible }) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [attachments, setAttachments] = useState([]);
  const [recipientId, setRecipientId] = useState(0);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const isContactChecked = (id) => recipientId === id;

  const handleCheckContact = (e) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    if (checked) {
      setRecipientId(id);
    } else {
      setRecipientId(0);
    }
  };

  const handleCancel = (e) => {
    setNewVisible(false);
  };

  const handleRemoveAttachment = (fileName) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  const handleSend = async (e) => {
    if (recipientId === 0) {
      toast.error("Please choose a recipient", { containerId: "B" });
      return;
    }
    try {
      setProgress(true);
      let attach_ids = [];
      if (attachments.length > 0) {
        attach_ids = (
          await xanoPost("/messages_attachments", "patient", {
            attachments_array: attachments,
          })
        ).data;
      }
      //create the message
      const message = {
        from_patient_id: user.id,
        to_staff_id: recipientId,
        subject: subject,
        body: body,
        attachments_ids: attach_ids,
        read_by_patient_id: user.id,
        date_created: Date.now(),
      };
      const response = await xanoPost(
        "/messages_external",
        "patient",

        message
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
      setNewVisible(false);
      toast.success("Message sent successfully", { containerId: "A" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error: unable to send message: ${err.message}`, {
        containerId: "B",
      });
      setProgress(false);
    }
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

  return (
    <div className="new-message new-message--patient">
      <div className="new-message__contacts new-message__contacts--patient">
        <ContactsForPatient
          staffInfos={staffInfos}
          isContactChecked={isContactChecked}
          handleCheckContact={handleCheckContact}
        />
      </div>
      <div className="new-message__form new-message__form--patient">
        <div className="new-message__recipients new-message__recipients--patient">
          <strong>To: </strong>
          <input
            type="text"
            placeholder="Staff member"
            value={
              recipientId ? staffIdToTitleAndName(staffInfos, recipientId) : ""
            }
            readOnly
          />
        </div>
        <div className="new-message__subject new-message__subject--patient">
          <strong>Subject: </strong>
          <input
            type="text"
            placeholder="Subject"
            onChange={handleChangeSubject}
            value={subject}
          />
        </div>
        <div className="new-message__attach new-message__attach--patient">
          <strong>Attach files</strong>
          <i className="fa-solid fa-paperclip" onClick={handleAttach}></i>
          {attachments.map((attachment) => (
            <span key={attachment.file.name} style={{ marginLeft: "5px" }}>
              {attachment.alias},
            </span>
          ))}
        </div>
        <div className="new-message__body new-message__body--patient">
          <textarea value={body} onChange={handleChange}></textarea>
          <MessagesAttachments
            attachments={attachments}
            handleRemoveAttachment={handleRemoveAttachment}
            deletable={true}
            addable={false}
          />
        </div>
        <div className="new-message__btns new-message__btns--patient">
          <button onClick={handleSend} disabled={isLoadingFile || progress}>
            Send
          </button>
          <button onClick={handleCancel} disabled={progress}>
            Cancel
          </button>
          {isLoadingFile && <CircularProgressMedium />}
        </div>
      </div>
      <ToastCalvin id="B" />
    </div>
  );
};

export default NewMessagePatient;
