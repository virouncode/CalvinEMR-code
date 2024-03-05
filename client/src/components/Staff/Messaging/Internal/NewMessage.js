import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useSocketContext from "../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";
import { categoryToTitle } from "../../../../utils/categoryToTitle";
import formatName from "../../../../utils/formatName";
import CircularProgressMedium from "../../../All/UI/Progress/CircularProgressMedium";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import Contacts from "../Contacts";
import MessagesAttachments from "../MessagesAttachments";
import Patients from "../Patients";

const NewMessage = ({ setNewVisible }) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [attachments, setAttachments] = useState([]);
  const [recipientsIds, setRecipientsIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [patient, setPatient] = useState({ id: 0, name: "" });
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const isContactChecked = (id) => recipientsIds.includes(id);
  const isCategoryChecked = (category) => categories.includes(category);
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

  const handleCheckContact = (e) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    const category = e.target.name;
    const categoryContactsIds = staffInfos
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);

    if (checked) {
      let recipientsIdsUpdated = [...recipientsIds, id];
      setRecipientsIds(recipientsIdsUpdated);
      if (
        categoryContactsIds.every((id) => recipientsIdsUpdated.includes(id))
      ) {
        setCategories([...categories, category]);
      }
    } else {
      let recipientsIdsUpdated = [...recipientsIds];
      recipientsIdsUpdated = recipientsIdsUpdated.filter(
        (recipientId) => recipientId !== id
      );
      setRecipientsIds(recipientsIdsUpdated);
      if (categories.includes(category)) {
        let categoriesUpdated = [...categories];
        categoriesUpdated = categoriesUpdated.filter(
          (categoryName) => categoryName !== category
        );
        setCategories(categoriesUpdated);
      }
    }
  };

  const handleCheckCategory = (e) => {
    const category = e.target.id;
    const checked = e.target.checked;
    const categoryContactsIds = staffInfos
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);

    if (checked) {
      setCategories([...categories, category]);
      //All contacts of category

      let recipientsIdsUpdated = [...recipientsIds];
      categoryContactsIds.forEach((id) => {
        if (!recipientsIdsUpdated.includes(id)) {
          recipientsIdsUpdated.push(id);
        }
      });
      setRecipientsIds(recipientsIdsUpdated);
    } else {
      let categoriesUpdated = [...categories];
      categoriesUpdated = categoriesUpdated.filter((name) => name !== category);
      setCategories(categoriesUpdated);

      let recipientsIdsUpdated = [...recipientsIds];
      recipientsIdsUpdated = recipientsIdsUpdated.filter(
        (id) => !categoryContactsIds.includes(id)
      );
      setRecipientsIds(recipientsIdsUpdated);
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
    if (!recipientsIds.length) {
      toast.error("Please choose at least one recipient", { containerId: "B" });
      return;
    }
    try {
      setProgress(true);
      const attach_ids = (
        await postPatientRecord("/attachments", user.id, auth.authToken, {
          attachments_array: attachments,
        })
      ).data;

      //create the message
      const message = {
        from_id: user.id,
        to_staff_ids: recipientsIds,
        subject: subject,
        body: body,
        attachments_ids: attach_ids,
        related_patient_id: patient.id,
        read_by_staff_ids: [user.id],
        date_created: Date.now(),
      };

      const response = await axiosXanoStaff.post("/messages", message, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
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
      <div className="new-message__contacts">
        <Contacts
          staffInfos={staffInfos}
          handleCheckContact={handleCheckContact}
          isContactChecked={isContactChecked}
          handleCheckCategory={handleCheckCategory}
          isCategoryChecked={isCategoryChecked}
        />
      </div>
      <div className="new-message__form">
        <div className="new-message__recipients">
          <strong>To: </strong>
          <input
            type="text"
            placeholder="Recipients"
            value={staffInfos
              .filter(({ id }) => recipientsIds.includes(id))
              .map(
                (staff) =>
                  (staff.title === "Doctor" ? "Dr. " : "") +
                  formatName(staff.full_name)
              )
              .join(", ")}
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

export default NewMessage;
