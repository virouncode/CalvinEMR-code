import React, { useState } from "react";
import { toast } from "react-toastify";

import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { categoryToTitle } from "../../../../utils/names/categoryToTitle";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import ToastCalvin from "../../../UI/Toast/ToastCalvin";
import MessagesAttachments from "../MessagesAttachments";
import StaffContacts from "../StaffContacts";
import MessageExternal from "./MessageExternal";

const ForwardMessageExternal = ({
  setForwardVisible,
  message,
  previousMsgs,
  patientName,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [attachments, setAttachments] = useState([]);
  const [recipientsIds, setRecipientsIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [body, setBody] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const isContactChecked = (id) => recipientsIds.includes(id);
  const isCategoryChecked = (category) => categories.includes(category);

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
    setForwardVisible(false);
  };

  const handleSend = async (e) => {
    if (!recipientsIds.length) {
      toast.error("Please choose at least one recipient", { containerId: "B" });
      return;
    }
    try {
      setProgress(true);
      let attach_ids;
      if (attachments.length > 0) {
        const response = await xanoPost(
          "/messages_attachments",
          "staff",

          { attachments_array: attachments }
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

      //create the message
      const forwardMessage = {
        from_id: user.id,
        to_staff_ids: recipientsIds,
        subject: previousMsgs.length
          ? `Fwd: ${message.subject.slice(message.subject.indexOf(":") + 1)}`
          : `Fwd: ${message.subject}`,
        body: body,
        attachments_ids: attach_ids,
        related_patient_id: message.from_patient_id || message.to_patient_id,
        read_by_staff_ids: [user.id],
        previous_messages: [
          ...message.previous_messages_ids.map(({ previous_message }) => {
            return { message_type: "External", id: previous_message.id };
          }),
          { message_type: "External", id: message.id },
        ],
        date_created: nowTZTimestamp(),
        type: "Internal", //back to internal !!!
      };

      //post the message
      const response = await xanoPost(
        "/messages",
        "staff",

        forwardMessage
      );
      socket.emit("message", {
        route: "MESSAGES INBOX", //because back to internal !!!
        action: "create",
        content: { data: response.data },
      });
      socket.emit("message", {
        route: "MESSAGES ABOUT PATIENT",
        action: "create",
        content: { data: response.data },
      });

      setForwardVisible(false);
      toast.success("Transfered successfully", { containerId: "A" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error: unable to forward message: ${err.message}`, {
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
            "staff",

            { content }
          );
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

  const handleRemoveAttachment = (fileName) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  return (
    <div className="forward-message">
      <div className="forward-message__contacts">
        <StaffContacts
          staffInfos={staffInfos}
          handleCheckContact={handleCheckContact}
          isContactChecked={isContactChecked}
          handleCheckCategory={handleCheckCategory}
          isCategoryChecked={isCategoryChecked}
        />
      </div>
      <div className="forward-message__form">
        <div className="forward-message__recipients">
          <strong>To: </strong>
          <input
            type="text"
            placeholder="Recipients"
            value={staffInfos
              .filter(({ id }) => recipientsIds.includes(id))
              .map((staff) => staffIdToTitleAndName(staffInfos, staff.id))
              .join(", ")}
            readOnly
          />
        </div>
        <div className="forward-message__subject">
          <strong>Subject:</strong>
          {previousMsgs.length
            ? `\u00A0Fwd: ${message.subject.slice(
                message.subject.indexOf(":") + 1
              )}`
            : `\u00A0Fwd: ${message.subject}`}
        </div>
        {patientName && (
          <div className="forward-message__patient">
            <strong>About patient: {"\u00A0"}</strong> {patientName}
          </div>
        )}
        <div className="forward-message__attach">
          <strong>Attach files</strong>
          <i className="fa-solid fa-paperclip" onClick={handleAttach}></i>
          {attachments.map((attachment) => (
            <span key={attachment.file.name} style={{ marginLeft: "5px" }}>
              {attachment.alias},
            </span>
          ))}
        </div>
        <div className="forward-message__body">
          <textarea value={body} onChange={handleChange}></textarea>
          <div className="forward-message__history">
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
            cardWidth="30%"
            addable={false}
          />
        </div>
        <div className="forward-message__btns">
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

export default ForwardMessageExternal;
