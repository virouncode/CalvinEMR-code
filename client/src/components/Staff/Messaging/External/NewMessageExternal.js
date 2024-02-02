import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { sendEmail } from "../../../../api/sendEmail";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuth from "../../../../hooks/useAuth";
import { patientIdToName } from "../../../../utils/patientIdToName";
import MessagesAttachments from "../MessagesAttachments";
import Patients from "../Patients";

const NewMessageExternal = ({ setNewVisible }) => {
  const { auth, user, clinic, socket } = useAuth();
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

  const isPatientChecked = (id) => recipientId === id;

  const handleCheckPatient = (e) => {
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
      const attach_ids = (
        await postPatientRecord("/attachments", user.id, auth.authToken, {
          attachments_array: attachments,
        })
      ).data;

      //create the message
      const message = {
        from_id: user.id,
        from_user_type: "staff",
        to_id: recipientId,
        to_user_type: "patient",
        subject: subject,
        body: body,
        attachments_ids: attach_ids,
        read_by_staff_id: user.id,
        date_created: Date.now(),
      };

      const response = await axiosXanoStaff.post(
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
      setNewVisible(false);

      //send an email and an SMS to patient
      await sendEmail(
        "virounk@gmail.com", //to be changed to patient email
        patientIdToName(clinic.demographicsInfos, recipientId),
        "Calvin EMR New message",
        "",
        "",
        "You have a new message, please login to your patient portal",
        `Best wishes, \nPowered by Calvin EMR`
      );

      fetch("/api/twilio/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // from: "New Life",
          to: "+33683267962", //to be changed to patient cell_phone
          body: `
Hello ${patientIdToName(clinic.demographicsInfos, recipientId)},
          
You have a new message, please login to your patient portal
          
Best wishes,
Powered by Calvin EMR`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(data);
          } else {
            console.log("error");
            toast.error(`Couldn't send the sms invitation : $(err.text)`, {
              containerId: "A",
            });
          }
        });

      toast.success("Message sent successfully", { containerId: "A" });

      //EMAIL + SMS pour prévenir le patient qu'il a un nouveau message dans son portail
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

  return (
    <div className="new-message">
      <div className="new-message__form">
        <div className="new-message__recipients">
          <strong>To: </strong>
          <input
            type="text"
            placeholder="Patient"
            value={
              recipientId
                ? patientIdToName(clinic.demographicsInfos, recipientId)
                : ""
            }
            readOnly
          />
        </div>
        <div className="new-message__subject">
          <strong>Subject: </strong>
          <input
            type="text"
            placeholder="Subject"
            onChange={handleChangeSubject}
            value={subject}
          />
        </div>
        <div className="new-message__attach">
          <strong>Attach files</strong>
          <i className="fa-solid fa-paperclip" onClick={handleAttach}></i>
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
          <button onClick={handleSend} disabled={isLoadingFile}>
            Send
          </button>
          <button onClick={handleCancel}>Cancel</button>
          {isLoadingFile && (
            <CircularProgress size="1rem" style={{ margin: "5px" }} />
          )}
        </div>
      </div>
      <div className="new-message__patients">
        <Patients
          handleCheckPatient={handleCheckPatient}
          isPatientChecked={isPatientChecked}
        />
      </div>
      <ToastContainer
        enableMultiContainer
        containerId={"B"}
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
    </div>
  );
};

export default NewMessageExternal;
