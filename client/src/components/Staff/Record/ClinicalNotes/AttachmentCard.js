import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import NewWindow from "react-new-window";
import useAuthContext from "../../../../hooks/useAuthContext";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import AddToReportsForm from "./AddToReportsForm";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const AttachmentCard = ({
  patientId,
  handleRemoveAttachment,
  attachment,
  deletable,
  attachmentsLoading,
  addable = true,
  date,
}) => {
  const { user, auth, socket } = useAuthContext();
  const [popUpVisible, setPopUpVisible] = useState(false);
  const handleImgClick = () => {
    setPopUpVisible(true);
  };
  const [addToReports, setAddToReports] = useState(false);

  const handleAddToReports = () => {
    setAddToReports(true);
  };
  //   try {
  //     const response = await postPatientRecord(
  //       "/reports",
  //       user.id,
  //       auth.authToken,
  //       {
  //         patient_id: patientId,
  //         Name: attachment.alias,
  //         Media: "Download",
  //         Format:"Binary",
  //         FileExtensionAndVersion: getExtension(attachment.path),
  //         FilePath : attachment.path,
  //         Content: {
  //           Media: attachment,
  //         },
  //         Class:
  //         assigned_staff_id: user.id,
  //         description: attachment.alias,
  //         file: attachment.file,
  //         acknowledged: false,
  //       },
  //       socket,
  //       "REPORTS"
  //     );
  //     socket.emit("message", {
  //       route: "DOCMAILBOX",
  //       action: "create",
  //       content: { data: response.data },
  //     });
  //     toast.success("Saved successfully", { containerId: "A" });
  //     // navigate(0); //to refresh the patient record
  //   } catch (err) {
  //     toast.error(`Error unable to save document: ${err.message}`, {
  //       containerId: "A",
  //     });
  //   }
  // };
  return (
    <>
      {!attachmentsLoading ? (
        <div className="clinical-notes__attachment-card">
          <div className="clinical-notes__attachment-thumbnail">
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
          <div className="clinical-notes__attachment-footer">
            <div className="clinical-notes__attachment-footer-title">
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
              <div className="clinical-notes-attachment__footer-btn">
                <button onClick={handleAddToReports}>
                  Add to patient reports
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <CircularProgress size="0.7rem" />
      )}
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
            <video controls>
              <source
                src={`${BASE_URL}${attachment.file.path}`}
                type={attachment.file.mime}
              />
            </video>
          ) : attachment.file.mime.includes("officedocument") ? (
            <div>
              <iframe
                title="office document"
                src={`https://docs.google.com/gview?url=${BASE_URL}${attachment.file.path}&embedded=true&widget=false`}
                onClick={handleImgClick}
                width="100%"
                height="100%"
                frameBorder="0"
              ></iframe>
            </div>
          ) : (
            <iframe
              title={attachment.alias}
              src={`${BASE_URL}${attachment.file.path}`}
              type={attachment.file.type}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </NewWindow>
      )}
      {addToReports && (
        <FakeWindow
          title={`ADD ATTACHMENT TO REPORTS`}
          width={1000}
          height={700}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 700) / 2}
          color="#94bae8"
          setPopUpVisible={setAddToReports}
        >
          <AddToReportsForm
            attachment={attachment}
            patientId={patientId}
            date={date}
            setAddToReports={setAddToReports}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default AttachmentCard;
