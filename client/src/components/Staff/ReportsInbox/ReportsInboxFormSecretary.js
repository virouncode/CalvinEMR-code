import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import { reportClassCT, reportFormatCT } from "../../../datas/codesTables";
import useAuthContext from "../../../hooks/useAuthContext";
import useSocketContext from "../../../hooks/useSocketContext";
import useUserContext from "../../../hooks/useUserContext";
import { toLocalDate } from "../../../utils/formatDates";
import { getExtension } from "../../../utils/getExtension";
import { reportSchema } from "../../../validation/reportValidation";
import GenericList from "../../All/UI/Lists/GenericList";
import LoadingParagraph from "../../All/UI/Tables/LoadingParagraph";
import ReportsInboxPatients from "./ReportsInboxPatients";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const ReportsInboxFormSecretary = ({ errMsg, setErrMsg }) => {
  //HOOKS
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [formDatas, setFormDatas] = useState({
    Format: "Binary",
  });
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
        File: null,
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

  const handleCheckPatient = (e, assignedStaffId) => {
    setErrMsg("");
    console.log("assigned staff id", assignedStaffId);
    setFormDatas({
      ...formDatas,
      patient_id: parseInt(e.target.id),
      assigned_staff_id: assignedStaffId,
    });
  };

  const handleContentChange = (e) => {
    setFormDatas({ ...formDatas, Content: { TextContent: e.target.value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    const datasToPost = {
      ...formDatas,
      SourceAuthorPhysician: { AuthorFreeText: formDatas.AuthorFreeText },
    };
    //Validation
    try {
      await reportSchema.validate(formDatas);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }

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
        route: "REPORTS INBOX",
        action: "create",
        content: { data: response.data },
      });
      if (formDatas.Format === "Binary") {
        fileInputRef.current.value = null;
      }
      setFormDatas({
        name: "",
        Format: "Binary",
        FileExtensionAndVersion: "",
        Content: {},
        Class: "",
        SubClass: "",
        EventDateTime: null,
        ReceivedDateTime: null,
        SourceAuthorPhysician: {
          AuthorFreeText: "",
        },
        Notes: "",
      });

      toast.success(
        "Report posted successfully to patient's assigned practician",
        { containerId: "A" }
      );
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
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        setIsLoadingFile(false);
        setFormDatas({
          ...formDatas,
          File: fileToUpload.data,
          FileExtensionAndVersion: getExtension(fileToUpload.data.path),
          Content: {},
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
    <div
      className="reportsinbox__form"
      style={{ border: errMsg && "solid 1.5px red" }}
    >
      <form className="reportsinbox__form-content" onSubmit={handleSubmit}>
        <div className="reportsinbox__form-row">
          <input type="submit" value="Post" disabled={isLoadingFile} />
        </div>
        <div className="reportsinbox__form-row">
          <label>Report Name</label>
          <input
            name="name"
            type="text"
            value={formDatas.name || ""}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="reportsinbox__form-row reportsinbox__form-row--patients">
          <label>Related patient</label>
          <ReportsInboxPatients
            isPatientChecked={isPatientChecked}
            handleCheckPatient={handleCheckPatient}
            label={false}
          />
        </div>
        <div className="reportsinbox__form-row">
          <label>Format</label>
          <GenericList
            name="Format"
            value={formDatas.Format || ""}
            handleChange={handleChange}
            list={reportFormatCT}
          />
        </div>
        <div className="reportsinbox__form-row">
          <label>File extension</label>
          <p>{formDatas.FileExtensionAndVersion || ""}</p>
        </div>
        {formDatas.Format === "Binary" ? (
          <div className="reportsinbox__form-row">
            <label>Content</label>
            <input
              name="Content"
              required
              type="file"
              onChange={handleUpload}
              accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx"
              ref={fileInputRef}
            />
          </div>
        ) : (
          <div className="reportsinbox__form-row reportsinbox__form-row--text">
            <label>Content</label>
            <textarea
              name="Content"
              value={formDatas.Content?.TextContent || ""}
              onChange={handleContentChange}
            />
          </div>
        )}
        <div className="reportsinbox__form-row">
          <label>Class</label>
          <GenericList
            name="Class"
            value={formDatas.Class || ""}
            handleChange={handleChange}
            list={reportClassCT}
          />
        </div>
        <div className="reportsinbox__form-row">
          <label>Sub class</label>
          <input
            type="text"
            name="SubClass"
            value={formDatas.SubClass || ""}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="reportsinbox__form-row">
          <label>Date of document</label>
          <input
            type="date"
            name="EventDateTime"
            value={toLocalDate(formDatas.EventDateTime)}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="reportsinbox__form-row">
          <label>Date received</label>
          <input
            type="date"
            name="ReceivedDateTime"
            value={toLocalDate(formDatas.ReceivedDateTime)}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="reportsinbox__form-row">
          <label>Author</label>
          <input
            type="text"
            name="AuthorFreeText"
            value={formDatas.AuthorFreeText || ""}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="reportsinbox__form-row reportsinbox__form-row--text">
          <label>Notes</label>
          <textarea
            name="Notes"
            value={formDatas.Notes || ""}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </form>
      <div className="reportsinbox__form-preview">
        {isLoadingFile && <LoadingParagraph />}
        {formDatas.File && formDatas.File.mime?.includes("image") ? (
          <img src={`${BASE_URL}${formDatas.File.path}`} alt="" width="100%" />
        ) : formDatas.File && formDatas.File.mime?.includes("video") ? (
          <video controls>
            <source
              src={`${BASE_URL}${formDatas.File.path}`}
              type={formDatas.File.mime}
            />
          </video>
        ) : formDatas.File &&
          formDatas.File.mime?.includes("officedocument") ? (
          <div>
            <iframe
              title="office document"
              src={`https://docs.google.com/gview?url=${BASE_URL}${formDatas.File.path}&embedded=true&widget=false`}
              width="100%"
              height="500px"
              frameBorder="0"
            />
          </div>
        ) : (
          formDatas.File && (
            <iframe
              title={formDatas.name}
              src={`${BASE_URL}${formDatas.File.path}`}
              type={formDatas.File.type}
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

export default ReportsInboxFormSecretary;