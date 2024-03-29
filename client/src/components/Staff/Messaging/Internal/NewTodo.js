import React, { useState } from "react";
import { toast } from "react-toastify";

import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import ToastCalvin from "../../../UI/Toast/ToastCalvin";
import MessagesAttachments from "../MessagesAttachments";
import Patients from "../Patients";

const NewTodo = ({
  setNewTodoVisible,
  initialPatient = { id: 0, name: "" },
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [attachments, setAttachments] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [patient, setPatient] = useState(initialPatient);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const isPatientChecked = (id) => patient.id === id;

  const handleCheckPatient = (e) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    const name = e.target.name;
    if (checked) {
      setPatient({ id, name });
    } else {
      setPatient({ id: 0, name: "" });
    }
  };

  const handleCancel = (e) => {
    setNewTodoVisible(false);
  };

  const handleRemoveAttachment = (fileName) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  const handleSend = async (e) => {
    try {
      setProgress(true);
      let attach_ids = [];
      if (attachments.length > 0) {
        attach_ids = (
          await xanoPost("/messages_attachments", "staff", {
            attachments_array: attachments,
          })
        ).data;
      }
      //create the message
      const message = {
        staff_id: user.id,
        subject: subject,
        body: body,
        attachments_ids: attach_ids,
        related_patient_id: patient.id,
        done: false,
        date_created: nowTZTimestamp(),
      };
      const response = await xanoPost("/todos", "staff", message);
      socket.emit("message", {
        route: "MESSAGES INBOX",
        action: "create",
        content: { data: response.data },
      });
      socket.emit("message", {
        route: "TO-DOS ABOUT PATIENT",
        action: "create",
        content: { data: response.data },
      });
      setNewTodoVisible(false);
      toast.success("To-do saved successfully", { containerId: "A" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error: unable to save to-do: ${err.message}`, {
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
          const response = await xanoPost("/upload/attachment", "staff", {
            content,
          });
          if (!response.data.type) response.data.type = "document";
          setAttachments([
            ...attachments,
            {
              file: response.data,
              alias: file.name,
              date_created: nowTZTimestamp(),
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

  return (
    <div className="new-message">
      <div className="new-message__form">
        <div className="new-message__subject">
          <strong>Subject: </strong>
          <input
            type="text"
            placeholder="Subject"
            onChange={handleChangeSubject}
            value={subject}
          />
        </div>
        <div className="new-message__patient">
          <strong>About patient: </strong>
          <input
            type="text"
            placeholder="Patient"
            value={patient.name}
            readOnly
          />
        </div>
        <div className="new-message__attach">
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
        <div className="new-message__body">
          <textarea value={body} onChange={handleChange}></textarea>
          <MessagesAttachments
            attachments={attachments}
            handleRemoveAttachment={handleRemoveAttachment}
            deletable={true}
            addable={false}
          />
        </div>
        <div className="new-message__btns">
          <button onClick={handleSend} disabled={isLoadingFile || progress}>
            Send
          </button>
          <button onClick={handleCancel} disabled={progress}>
            Cancel
          </button>
          {isLoadingFile && <CircularProgressMedium />}
        </div>
      </div>
      <div className="new-message__patients">
        <Patients
          handleCheckPatient={handleCheckPatient}
          isPatientChecked={isPatientChecked}
          msgType="Internal"
        />
      </div>
      <ToastCalvin id="B" />
    </div>
  );
};

export default NewTodo;
