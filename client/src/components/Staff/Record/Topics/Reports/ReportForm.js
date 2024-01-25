import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../../api/xanoStaff";
import {
  reportClassCT,
  reportFormatCT,
} from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import { toLocalDate } from "../../../../../utils/formatDates";
import { getExtension } from "../../../../../utils/getExtension";
import { reportSchema } from "../../../../../validation/reportValidation";
import GenericList from "../../../../All/UI/Lists/GenericList";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const ReportForm = ({
  demographicsInfos,
  patientId,
  setAddVisible,
  editCounter,
  setErrMsgPost,
  errMsgPost,
}) => {
  //HOOKS
  const { auth, user, socket } = useAuth();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    Format: "Binary",
    assigned_staff_id: demographicsInfos.assigned_staff_id,
  });
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;

    if (
      name === "EventDateTime" ||
      name === "ReceivedDateTime" ||
      name === "DateTimeSent"
    ) {
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
  const handleContentChange = (e) => {
    setFormDatas({ ...formDatas, Content: { TextContent: e.target.value } });
  };
  const handleReviewedName = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      ReportReviewed: {
        ...formDatas.ReportReviewed,
        Name: { ...formDatas.ReportReviewed?.Name, [name]: value },
      },
    });
  };
  const handleReviewedOHIP = (e) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      ReportReviewed: {
        ...formDatas.ReportReviewed,
        ReviewingOHIPPhysicianId: value,
      },
    });
  };
  const handleReviewedDate = (e) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      ReportReviewed: {
        ...formDatas.ReportReviewed,
        DateTimeReportReviewed: Date.parse(new Date(value)),
      },
    });
  };
  const handleRecipientName = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      RecipientName: { ...formDatas.RecipientName, [name]: value },
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsgPost("");
    //Formatting
    const datasToPost = {
      ...formDatas,
      SourceAuthorPhysician: {
        AuthorFreeText: formDatas.AuthorFreeText,
      },
    };
    if (datasToPost.ReportReviewed?.Name?.FirstName) {
      datasToPost.ReportReviewed = [datasToPost.ReportReviewed];
      datasToPost.acknowledged = true;
    }

    //Validating
    // if (datasToPost.Format === "Binary" && !datasToPost.Content.Media.type) {
    //   datasToPost.Content.Media.type = "document";
    // }

    //Validation
    try {
      await reportSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
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
        route: "DOCMAILBOX",
        action: "create",
        content: { data: response.data },
      });

      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error unable to save document: ${err.message}`, {
        containerId: "B",
      });
    }
  };
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrMsgPost("");
    if (file.size > 25000000) {
      setErrMsgPost("The file is over 25Mb, please choose another file");
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
    <div
      className="reports__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <form className="reports__content" onSubmit={handleSubmit}>
        {errMsgPost && <div className="reports__err">{errMsgPost}</div>}
        <div className="reports__form-btn-container">
          <input type="submit" value="Save" />
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
        <div className="reports__row">
          <label>Name</label>
          <input
            type="text"
            autoComplete="off"
            name="name"
            value={formDatas.name}
            onChange={handleChange}
          />
        </div>
        <div className="reports__row">
          <label>Format</label>
          <GenericList
            name="Format"
            value={formDatas.Format}
            handleChange={handleChange}
            list={reportFormatCT}
          />
        </div>
        <div className="reports__row">
          <label>File extension</label>
          <p>{formDatas.FileExtensionAndVersion}</p>
        </div>
        <div className="reports__row">
          <label>Content</label>
          {formDatas.Format === "Binary" ? (
            <input
              name="Content"
              required
              type="file"
              onChange={handleUpload}
              accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx"
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
        <div className="reports__row">
          <label>Class</label>
          <GenericList
            name="Class"
            value={formDatas.Class}
            handleChange={handleChange}
            list={reportClassCT}
          />
        </div>
        <div className="reports__row">
          <label>Sub class</label>
          <input
            type="text"
            name="SubClass"
            value={formDatas.SubClass}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="reports__row">
          <label>Date of document</label>
          <input
            type="date"
            name="EventDateTime"
            value={toLocalDate(formDatas.EventDateTime)}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="reports__row">
          <label>Date received</label>
          <input
            type="date"
            name="ReceivedDateTime"
            value={toLocalDate(formDatas.ReceivedDateTime)}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="reports__row">
          <label>Author</label>
          <input
            type="text"
            name="AuthorFreeText"
            value={formDatas.AuthorFreeText}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="reports__row reports__row--special">
          <label>Reviewed by</label>
          <div>
            <div className="reports__subrow">
              <label>First name</label>
              <input
                type="text"
                name="FirstName"
                value={formDatas.ReportReviewed?.Name?.FirstName}
                onChange={handleReviewedName}
                autoComplete="off"
              />
            </div>
            <div className="reports__subrow">
              <label>Last name</label>
              <input
                type="text"
                name="LastName"
                value={formDatas.ReportReviewed?.Name?.LastName}
                onChange={handleReviewedName}
                autoComplete="off"
              />
            </div>
            <div className="reports__subrow">
              <label>OHIP#</label>
              <input
                type="text"
                name="ReviewingOHIPPhysicianId"
                value={formDatas.ReportReviewed?.ReviewingOHIPPhysicianId}
                onChange={handleReviewedOHIP}
                autoComplete="off"
              />
            </div>
            <div className="reports__subrow">
              {" "}
              <label>Date reviewed</label>
              <input
                type="date"
                name="DateTimeReportReviewed"
                value={toLocalDate(
                  formDatas.ReportReviewed?.DateTimeReportReviewed
                )}
                onChange={handleReviewedDate}
              />
            </div>
          </div>
        </div>
        <div className="reports__row reports__row--text">
          <label>Notes</label>
          <textarea
            name="Notes"
            value={formDatas.Notes}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="reports__row reports__row--special">
          <label>Recipient</label>
          <div>
            <div className="reports__subrow">
              <label>First name</label>
              <input
                type="text"
                name="FirstName"
                value={formDatas.RecipientName?.FirstName}
                onChange={handleRecipientName}
                autoComplete="off"
              />
            </div>
            <div className="reports__subrow">
              <label>Last name</label>
              <input
                type="text"
                name="LastName"
                value={formDatas.RecipientName?.LastName}
                onChange={handleRecipientName}
                autoComplete="off"
              />
            </div>
            <div className="reports__subrow">
              <label>Date sent</label>
              <input
                type="date"
                name="DateTimeSent"
                value={toLocalDate(formDatas.DateTimeSent)}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="reports__row">
          {isLoadingFile && (
            <CircularProgress size="1rem" style={{ margin: "5px" }} />
          )}
        </div>
      </form>
      <div className="reports__preview">
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
              title={formDatas.name}
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

export default ReportForm;
