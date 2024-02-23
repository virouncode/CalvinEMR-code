import React, { useState } from "react";
import NewWindow from "react-new-window";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../api/fetchRecords";
import useAuthContext from "../../../hooks/useAuthContext";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const MessageAttachmentCard = ({
  patientId,
  handleRemoveAttachment,
  attachment,
  deletable,
  cardWidth = "30%",
  addable = true,
}) => {
  const { user, auth, socket } = useAuthContext();
  const [popUpVisible, setPopUpVisible] = useState(false);
  const handleImgClick = () => {
    setPopUpVisible(true);
  };

  const handleAddToReports = async () => {
    try {
      const response = await postPatientRecord(
        "/documents",
        user.id,
        auth.authToken,
        {
          patient_id: patientId,
          assigned_id: user.id,
          description: attachment.alias,
          file: attachment.file,
        },
        socket,
        "DOCUMENTS"
      );
      socket.emit("message", {
        route: "REPORTS INBOX",
        action: "create",
        content: { data: response.data },
      });

      toast.success("Saved successfully", { containerId: "A" });
    } catch (err) {
      toast.error(`Error unable to save document: ${err.message}`, {
        containerId: "A",
      });
    }
  };

  return (
    <>
      <div className="message-attachment__card" style={{ width: cardWidth }}>
        <div className="message-attachment__thumbnail">
          {attachment.file.mime.includes("image") ? (
            <img
              src={`${BASE_URL}${attachment.file.path}`}
              alt="attachment thumbnail"
              width="100%"
              onClick={handleImgClick}
            />
          ) : attachment.file.mime.includes("video") ? (
            <video onClick={handleImgClick} width="100%">
              <source
                src={`${BASE_URL}${attachment.file.path}`}
                type={attachment.file.mime}
              />
            </video>
          ) : attachment.file.mime.includes("officedocument") ? (
            <div>
              <div
                style={{ color: "blue", fontSize: "0.8rem" }}
                onClick={handleImgClick}
              >
                Preview document
              </div>{" "}
              <iframe
                title="office document"
                src={`https://docs.google.com/gview?url=${BASE_URL}${attachment.file.path}&embedded=true&widget=false`}
                onClick={handleImgClick}
                width="150%"
                frameBorder="0"
              ></iframe>
            </div>
          ) : (
            <div>
              <iframe
                id="thumbnail-doc"
                title={attachment.alias}
                src={`${BASE_URL}${attachment.file.path}`}
                type={attachment.file.type}
                width="100%"
              />
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  width: "100%",
                  height: "100%",
                  opacity: "0",
                  cursor: "pointer",
                }}
                onClick={handleImgClick}
              ></div>
            </div>
          )}
        </div>
        <div className="message-attachment__footer">
          <div className="message-attachment__title">
            <p
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: "0",
              }}
            >
              {attachment.alias}
            </p>
            {deletable && (
              <i
                className="fa-solid fa-xmark"
                style={{ cursor: "pointer" }}
                onClick={() => handleRemoveAttachment(attachment.file.name)}
              ></i>
            )}
          </div>
          {addable && (
            <div className="message-attachment__btn">
              <button onClick={handleAddToReports}>
                Add to patient reports
              </button>
            </div>
          )}
        </div>
      </div>
      {popUpVisible && (
        <NewWindow
          title={attachment.alias}
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 800,
            height: 600,
            left: 320,
            top: 200,
          }}
          onUnload={() => setPopUpVisible(false)}
        >
          {attachment.file.mime.includes("image") ? (
            <img
              src={`${BASE_URL}${attachment.file.path}`}
              alt=""
              width="100%"
            />
          ) : attachment.file.mime.includes("video") ? (
            <video width="100%" controls>
              <source
                src={`${BASE_URL}${attachment.file.path}`}
                type={attachment.file.mime}
              />
            </video>
          ) : attachment.file.mime.includes("officedocument") ? (
            <iframe
              title="office document"
              src={`https://docs.google.com/gview?url=${BASE_URL}${attachment.file.path}&embedded=true&widget=false`}
              width="100%"
              height="100%"
              frameBorder="0"
            />
          ) : (
            <iframe
              title={attachment.aias}
              src={`${BASE_URL}${attachment.file.path}`}
              type={attachment.file.type}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </NewWindow>
      )}
    </>
  );
};

export default MessageAttachmentCard;
