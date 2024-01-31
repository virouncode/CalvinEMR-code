import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { reportClassCT } from "../../../../datas/codesTables";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDate } from "../../../../utils/formatDates";
import { getExtension } from "../../../../utils/getExtension";
import GenericList from "../../../All/UI/Lists/GenericList";
const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const AddToReportsForm = ({ attachment, patientId, date, setAddToReports }) => {
  const { user, auth, socket } = useAuth();
  const [errMsgPost, setErrMsgPost] = useState("");
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    name: attachment.alias,
    Media: "Download",
    Format: "Binary",
    FileExtensionAndVersion: getExtension(attachment.file.path),
    File: attachment,
    ReceivedDateTime: date,
    assigned_staff_id: user.id,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPost = {
      ...formDatas,
      SourceAuthorPhysician: { AuthorFreeText: formDatas.AuthorFreeText },
    };

    if (datasToPost.ReportReviewed?.Name?.FirstName) {
      datasToPost.ReportReviewed = [datasToPost.ReportReviewed];
      datasToPost.acknowledged = true;
    }

    // if (datasToPost.Format === "Binary" && !datasToPost.File.type) {
    //   datasToPost.File.type = "document";
    // }

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
      setAddToReports(false);
      toast.success("Saved successfully", { containerId: "A" });
    } catch (err) {
      toast.error(`Error unable to save attachment: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  return (
    <div className="reports__form">
      <form className="reports__content" onSubmit={handleSubmit}>
        {errMsgPost && <p className="reports__err">{errMsgPost}</p>}
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
          {formDatas.Format}
        </div>
        <div className="reports__row">
          <label>File extension</label>
          {formDatas.FileExtensionAndVersion}
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
          <input type="submit" value="Save" />
        </div>
      </form>
      <div className="reports__preview">
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
              title={formDatas.alias}
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

export default AddToReportsForm;
