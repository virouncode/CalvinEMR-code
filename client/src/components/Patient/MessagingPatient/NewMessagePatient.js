import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoPatient } from "../../../api/xanoPatient";
import useAuthContext from "../../../hooks/useAuthContext";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";
import ToastCalvin from "../../All/UI/Toast/ToastCalvin";
import MessagesAttachments from "../../Staff/Messaging/MessagesAttachments";
import ContactsForPatient from "./ContactsForPatient";

const NewMessagePatient = ({ setNewVisible }) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [attachments, setAttachments] = useState([]);
  const [recipientId, setRecipientId] = useState(0);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);

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
      const attachmentsToPost = attachments.map((attachment) => {
        return { ...attachment, date_created: Date.now() };
      });
      let attach_ids = (
        await axiosXanoPatient.post(
          "/attachments",
          {
            attachments_array: attachmentsToPost,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        )
      ).data;

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

      const response = await axiosXanoPatient.post(
        "/messages_external",
        message,
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
            "Content-Type": "application/json",
          },
        }
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
    } catch (err) {
      toast.error(`Error: unable to send message: ${err.message}`, {
        containerId: "B",
      });
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
          const response = await axiosXanoPatient.post(
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
              recipientId
                ? staffIdToTitleAndName(staffInfos, recipientId, true)
                : ""
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
          <button onClick={handleSend} disabled={isLoadingFile}>
            Send
          </button>
          <button onClick={handleCancel}>Cancel</button>
          {isLoadingFile && <CircularProgressMedium />}
        </div>
      </div>
      <ToastCalvin id="B" />
    </div>
  );
};

export default NewMessagePatient;
