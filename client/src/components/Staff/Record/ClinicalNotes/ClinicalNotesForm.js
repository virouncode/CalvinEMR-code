import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuth from "../../../../hooks/useAuth";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { clinicalSchema } from "../../../../validation/clinicalValidation";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import ClinicalNotesAttachments from "./ClinicalNotesAttachments";
import ClinicalNotesTemplatesList from "./ClinicalNotesTemplatesList";
import EditTemplate from "./EditTemplate";
import NewTemplate from "./NewTemplate";

const ClinicalNotesForm = ({ setAddVisible, patientId, demographicsInfos }) => {
  //hooks
  const { auth, user, clinic, socket } = useAuth();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    subject: "Clinical note",
    MyClinicalNotesContent: "",
    version_nbr: 1,
    attachments_ids: [],
  });
  const [attachments, setAttachments] = useState([]);
  const [templateSelectedId, setTemplateSelectedId] = useState("");
  const [templates, setTemplates] = useState([]);
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [editTemplateVisible, setEditTemplateVisible] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const abortController = new AbortController();
    const fetchTemplates = async () => {
      try {
        const response = await axiosXanoStaff.get("/clinical_notes_templates", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        setTemplates(
          response.data.sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          )
        );
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error(`Error: unable to fetch templates: ${err.message}`, {
            containerId: "A",
          });
        }
      }
    };
    fetchTemplates();
    return () => abortController.abort();
  }, [auth.authToken]);

  //HANDLERS
  const handleCancelClick = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to cancel ? You changes won't be saved",
      })
    ) {
      setAddVisible(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await clinicalSchema.validate(formDatas);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    try {
      const attach_ids = (
        await postPatientRecord("/attachments", user.id, auth.authToken, {
          attachments_array: attachments,
        })
      ).data;

      await postPatientRecord(
        "/clinical_notes",
        user.id,
        auth.authToken,
        {
          ...formDatas,
          attachments_ids: attach_ids,
          ParticipatingProviders: [
            {
              Name: {
                FirstName: staffIdToFirstName(clinic.staffInfos, user.id),
                LastName: staffIdToLastName(clinic.staffInfos, user.id),
              },
              OHIPPhysicianId: staffIdToOHIP(clinic.staffInfos, user.id),
              DateTimeNoteCreated: Date.now(),
            },
          ],
        },
        socket,
        "CLINICAL NOTES"
      );
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "A" });
    } catch (err) {
      toast.error(`Error: unable to save clinical note: ${err.message}`, {
        containerId: "A",
      });
    }
  };

  const handleSaveSignBillClick = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await clinicalSchema.validate(formDatas);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    try {
      const attach_ids = (
        await postPatientRecord("/attachments", user.id, auth.authToken, {
          attachments_array: attachments,
        })
      ).data;

      await postPatientRecord(
        "/clinical_notes",
        user.id,
        auth.authToken,
        {
          ...formDatas,
          attachments_ids: attach_ids,
          ParticipatingProviders: [
            {
              Name: {
                FirstName: staffIdToFirstName(clinic.staffInfos, user.id),
                LastName: staffIdToLastName(clinic.staffInfos, user.id),
              },
              OHIPPhysicianId: staffIdToOHIP(clinic.staffInfos, user.id),
              DateTimeNoteCreated: Date.now(),
            },
          ],
        },
        socket,
        "CLINICAL NOTES"
      );
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "A" });
    } catch (err) {
      toast.error(`Error: unable to save clinical note: ${err.message}`, {
        containerId: "A",
      });
    }
    window.open(
      `/staff/billing/${patientId}/${
        demographicsInfos.HealthCard?.Number
      }/${Date.now()}`,
      "_blank"
    );
  };
  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleAttach = () => {
    let input = document.createElement("input");
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

  const handleRemoveAttachment = (fileName) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  const handleSelectTemplate = (e) => {
    setErrMsg("");
    const value = parseInt(e.target.value);
    setTemplateSelectedId(value);
    if (value !== -1 && value !== -2) {
      setFormDatas({
        ...formDatas,
        MyClinicalNotesContent: templates.find(
          ({ id }) => id === parseInt(value)
        ).MyClinicalNotesContent,
      });
    } else if (value === -1) {
      setNewTemplateVisible(true);
    } else if (value === -2) {
      if (!templates.filter(({ author_id }) => author_id === user.id).length) {
        alert("You don't have any templates");
        setTemplateSelectedId("");
        return;
      }
      setEditTemplateVisible(true);
    }
  };

  return (
    <>
      <form className="clinical-notes__form" onSubmit={handleSubmit}>
        <div className="clinical-notes__form-header">
          <div className="clinical-notes__form-row">
            <p>
              <strong>From: </strong>
              {staffIdToTitleAndName(clinic.staffInfos, user.id, true)}
            </p>
            <div className="clinical-notes__form-template">
              <label>
                <strong>Use template: </strong>
              </label>
              <ClinicalNotesTemplatesList
                templates={templates}
                templateSelectedId={templateSelectedId}
                handleSelectTemplate={handleSelectTemplate}
              />
            </div>
          </div>
          <div className="clinical-notes__form-row">
            <div>
              <label>
                <strong>Subject: </strong>
              </label>
              <input
                type="text"
                name="subject"
                onChange={handleChange}
                value={formDatas.subject}
                autoComplete="off"
              />
            </div>
            <div>
              <label>
                <strong>Attach files: </strong>
              </label>
              <i
                className="fa-solid fa-paperclip"
                style={{ cursor: "pointer" }}
                onClick={handleAttach}
              ></i>
            </div>
          </div>
        </div>
        <div className="clinical-notes__form-body">
          {errMsg && <p className="clinical-notes__form-err">{errMsg}</p>}
          <textarea
            name="MyClinicalNotesContent"
            onChange={handleChange}
            value={formDatas.MyClinicalNotesContent}
          />
          <ClinicalNotesAttachments
            attachments={attachments}
            handleRemoveAttachment={handleRemoveAttachment}
            deletable={true}
            addable={false}
          />
        </div>
        <div className="clinical-notes__form-btns">
          <button
            type="button"
            disabled={isLoadingFile}
            onClick={handleSaveSignBillClick}
          >
            Save & Sign & Bill
          </button>
          <input type="submit" value="Save & Sign" disabled={isLoadingFile} />
          <button type="button" onClick={handleCancelClick}>
            Cancel
          </button>
          {isLoadingFile && (
            <CircularProgress size="1rem" style={{ margin: "5px" }} />
          )}
        </div>
      </form>
      {newTemplateVisible && (
        <FakeWindow
          title="NEW TEMPLATE"
          width={1000}
          height={500}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 500) / 2}
          color={"#94bae8"}
          setPopUpVisible={setNewTemplateVisible}
          closeCross={false}
        >
          <NewTemplate
            setNewTemplateVisible={setNewTemplateVisible}
            templates={templates}
            setTemplateSelectedId={setTemplateSelectedId}
            setTemplates={setTemplates}
            setFormDatas={setFormDatas}
            formDatas={formDatas}
          />
        </FakeWindow>
      )}
      {editTemplateVisible && (
        <FakeWindow
          title="EDIT TEMPLATE"
          width={1000}
          height={500}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 500) / 2}
          color={"#94bae8"}
          setPopUpVisible={setEditTemplateVisible}
        >
          <EditTemplate
            setEditTemplateVisible={setEditTemplateVisible}
            myTemplates={templates.filter(
              ({ author_id }) => author_id === user.id
            )}
            setTemplateSelectedId={setTemplateSelectedId}
            setTemplates={setTemplates}
            setFormDatas={setFormDatas}
            formDatas={formDatas}
          />
        </FakeWindow>
      )}{" "}
    </>
  );
};

export default ClinicalNotesForm;
