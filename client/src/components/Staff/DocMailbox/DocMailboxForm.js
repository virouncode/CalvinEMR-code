import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuth from "../../../hooks/useAuth";
import { firstLetterUpper } from "../../../utils/firstLetterUpper";
import DocMailboxPatients from "./DocMailboxPatients";
const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const DocMailboxForm = ({ setAddVisible, setErrMsg }) => {
  //HOOKS
  const { auth, user, socket } = useAuth();
  const [formDatas, setFormDatas] = useState({
    patient_id: 0,
    assigned_id: user.id,
    description: "",
    file: null,
    acknowledged: false,
  });
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsg("");
    let value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setAddVisible(false);
    setErrMsg("");
  };

  const isPatientChecked = (id) => {
    return formDatas.patient_id === parseInt(id);
  };

  const handleCheckPatient = (e) => {
    setErrMsg("");
    setFormDatas({ ...formDatas, patient_id: parseInt(e.target.id) });
  };

  const handleSubmit = async (e) => {
    setErrMsg("");
    e.preventDefault();
    const datasToPost = {
      ...formDatas,
      description: firstLetterUpper(formDatas.description),
    };
    //Validation
    if (datasToPost.description === "") {
      setErrMsg("Description field is required");
      return;
    }
    if (datasToPost.patient_id === 0) {
      setErrMsg("Please choose a related patient");
      return;
    }
    // Formatting
    setFormDatas({
      ...formDatas,
      description: firstLetterUpper(formDatas.description),
    });
    if (!datasToPost.file.type) datasToPost.file.type = "document";

    try {
      const response1 = await postPatientRecord(
        "/documents",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "DOCUMENTS"
      );
      socket.emit("message", {
        route: "DOCMAILBOX",
        action: "create",
        content: { data: response1.data },
      });
      setAddVisible(false);
      toast.success("Posted successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error unable to save document: ${err.message}`, {
        containerId: "B",
      });
    }
  };
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrMsg("");
    setSaveDisabled(true);
    if (file.size > 25000000) {
      setErrMsg("The file is over 25Mb, please choose another file");
      setIsLoadingFile(false);
      return;
    }
    // setting up the reader
    setIsLoadingFile(true);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      let fileToUpload;
      try {
        fileToUpload = await axiosXanoStaff.post(
          "/upload/attachment",
          {
            content: content,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        setIsLoadingFile(false);
        setSaveDisabled(false);
        setFormDatas({
          ...formDatas,
          file: fileToUpload.data,
        });
      } catch (err) {
        setIsLoadingFile(false);
        toast.error(`Error unable to load document: ${err.message}`, {
          containerId: "B",
        });
      }
    };
  };

  return (
    <div className="docmailbox__form">
      <form className="docmailbox__form-content" onSubmit={handleSubmit}>
        <div className="docmailbox__form-row">
          <label>Description</label>
          <input
            name="description"
            type="text"
            value={formDatas.description}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="docmailbox__form-row docmailbox__form-row--patients">
          <label>Related patient</label>
          <DocMailboxPatients
            isPatientChecked={isPatientChecked}
            handleCheckPatient={handleCheckPatient}
            label={false}
          />
        </div>
        <div className="docmailbox__form-row">
          <label>Upload document</label>
          <input
            name="file"
            required
            type="file"
            onChange={handleUpload}
            accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx"
          />
        </div>
        <div className="docmailbox__form-row">
          {isLoadingFile && (
            <CircularProgress size="1rem" style={{ margin: "5px" }} />
          )}
        </div>
        <div className="docmailbox__form-btn-container">
          <input type="submit" value="Post" disabled={saveDisabled} />
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
      <div className="docmailbox__form-preview">
        {formDatas.file && formDatas.file.mime.includes("image") ? (
          <img src={`${BASE_URL}${formDatas.file.path}`} alt="" width="100%" />
        ) : formDatas.file && formDatas.file.mime.includes("video") ? (
          <video controls>
            <source
              src={`${BASE_URL}${formDatas.file.path}`}
              type={formDatas.file.mime}
            />
          </video>
        ) : formDatas.file && formDatas.file.mime.includes("officedocument") ? (
          <div>
            <iframe
              title="office document"
              src={`https://docs.google.com/gview?url=${BASE_URL}${formDatas.file.path}&embedded=true&widget=false`}
              width="100%"
              height="500px"
            />
          </div>
        ) : (
          formDatas.file && (
            <iframe
              title={formDatas.alias}
              src={`${BASE_URL}${formDatas.file.path}`}
              type={formDatas.file.type}
              width="100%"
              style={{ border: "none" }}
              height="500px"
            />
          )
        )}
      </div>
    </div>
  );
};

export default DocMailboxForm;
