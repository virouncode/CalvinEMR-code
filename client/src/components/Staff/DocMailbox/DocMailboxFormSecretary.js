import { CircularProgress } from "@mui/material";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import { reportClassCT, reportFormatCT } from "../../../datas/codesTables";
import useAuth from "../../../hooks/useAuth";
import { toLocalDate } from "../../../utils/formatDates";
import { getExtension } from "../../../utils/getExtension";
import GenericList from "../../All/UI/Lists/GenericList";
import DocMailboxPatients from "./DocMailboxPatients";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const DocMailboxFormSecretary = ({ errMsg, setErrMsg }) => {
  //HOOKS
  const { auth, user, clinic, socket } = useAuth();
  const [formDatas, setFormDatas] = useState({
    Format: "Binary",
  });
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const fileInputRef = useRef(null);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsg("");
    let value = e.target.value;
    const name = e.target.name;

    if (name === "EventDateTime" || name === "ReceivedDateTime") {
      value = value ? Date.parse(new Date(value)) : null;
    }
    if (name === "Format") {
      setFormDatas({
        ...formDatas,
        Content: {},
        FileExtensionAndVersion: "",
        [name]: value,
      });
      return;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const isPatientChecked = (id) => {
    return formDatas.patient_id === parseInt(id);
  };

  const handleCheckPatient = (e) => {
    setErrMsg("");
    setFormDatas({ ...formDatas, patient_id: parseInt(e.target.id) });
  };

  const handleContentChange = (e) => {
    setFormDatas({ ...formDatas, Content: { TextContent: e.target.value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    const datasToPost = {
      ...formDatas,
      assigned_staff_id: clinic.demographicsInfos.find(
        ({ patient_id }) => patient_id === formDatas.patient_id
      )?.assigned_staff_id,
      SourceAuthorPhysician: { AuthorFreeText: formDatas.AuthorFreeText },
    };
    //Validation

    try {
      const response = await postPatientRecord(
        "/reports",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "REPORTS"
      );
      socket.emit("message", {
        route: "DOCMAILBOX",
        action: "create",
        content: { data: response.data },
      });
      setFormDatas({
        ...formDatas,
        Name: "",
        patient_id: 0,
        Format: "Binary",
        FileExtensionAndVersion: "",
        Content: {},
        Class: "",
        SubClass: "",
        EventDateTime: null,
        ReceivedDateTime: null,
        AuthorFreeText: "",
        Notes: "",
      });
      fileInputRef.current.content = null;
      toast.success("Posted successfully", { containerId: "A" });
    } catch (err) {
      toast.error(`Error unable to save document: ${err.message}`, {
        containerId: "A",
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
          Content: { Media: fileToUpload.data },
          FileExtensionAndVersion: getExtension(fileToUpload.data.path),
          FilePath: fileToUpload.data.path,
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
          <label>Name</label>
          <input
            name="Name"
            type="text"
            value={formDatas.Name}
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
          <label>Format</label>
          <GenericList
            name="Format"
            value={formDatas.Format}
            handleChange={handleChange}
            list={reportFormatCT}
          />
        </div>
        <div className="docmailbox__form-row">
          <label>File extension</label>
          <p>{formDatas.FileExtensionAndVersion}</p>
        </div>
        <div className="docmailbox__form-row">
          <label>Content</label>
          {formDatas.Format === "Binary" ? (
            <input
              name="Content"
              required
              type="file"
              onChange={handleUpload}
              accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx"
              ref={fileInputRef}
            />
          ) : (
            <input
              type="text"
              autoComplete="off"
              name="Content"
              value={formDatas.Content?.TextContent}
              onChange={handleContentChange}
            />
          )}
        </div>
        <div className="docmailbox__form-row">
          <label>Class</label>
          <GenericList
            name="Class"
            value={formDatas.Class}
            handleChange={handleChange}
            list={reportClassCT}
          />
        </div>
        <div className="docmailbox__form-row">
          <label>Sub class</label>
          <input
            type="text"
            name="SubClass"
            value={formDatas.SubClass}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="docmailbox__form-row">
          <label>Date of document</label>
          <input
            type="date"
            name="EventDateTime"
            value={toLocalDate(formDatas.EventDateTime)}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="docmailbox__form-row">
          <label>Date received</label>
          <input
            type="date"
            name="ReceivedDateTime"
            value={toLocalDate(formDatas.ReceivedDateTime)}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="docmailbox__form-row">
          <label>Author</label>
          <input
            type="text"
            name="AuthorFreeText"
            value={formDatas.AuthorFreeText}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="docmailbox__form-row docmailbox__form-row--text">
          <label>Notes</label>
          <textarea
            name="Notes"
            value={formDatas.Notes}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="docmailbox__form-row">
          {isLoadingFile && (
            <CircularProgress size="1rem" style={{ margin: "5px" }} />
          )}
        </div>
        <div className="docmailbox__form-row">
          <input type="submit" value="Post" disabled={saveDisabled} />
        </div>
      </form>
      <div className="docmailbox__form-preview">
        {formDatas.Content?.Media &&
        formDatas.Content?.Media?.mime?.includes("image") ? (
          <img
            src={`${BASE_URL}${formDatas.Content?.Media?.path}`}
            alt=""
            width="100%"
          />
        ) : formDatas.Content?.Media &&
          formDatas.Content?.Media?.mime?.includes("video") ? (
          <video controls>
            <source
              src={`${BASE_URL}${formDatas.Content?.Media?.path}`}
              type={formDatas.Content?.Media?.mime}
            />
          </video>
        ) : formDatas.Content?.Media &&
          formDatas.Content?.Media?.mime?.includes("officedocument") ? (
          <div>
            <iframe
              title="office document"
              src={`https://docs.google.com/gview?url=${BASE_URL}${formDatas.Content?.Media?.path}&embedded=true&widget=false`}
              width="100%"
              height="500px"
              frameBorder="0"
            />
          </div>
        ) : (
          formDatas.Content?.Media && (
            <iframe
              title={formDatas.Name}
              src={`${BASE_URL}${formDatas.Content?.Media?.path}`}
              type={formDatas.Content?.Media?.type}
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

export default DocMailboxFormSecretary;
