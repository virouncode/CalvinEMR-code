import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { postPatientRecord } from "../../../../api/fetchRecords";
import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useClinicalTemplatesSocket from "../../../../hooks/useClinicalTemplatesSocket";
import useFetchDatas from "../../../../hooks/useFetchDatas";
import useSocketContext from "../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";
import { nowTZTimestamp } from "../../../../utils/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/toPatientName";
import { clinicalSchema } from "../../../../validation/clinicalValidation";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";
import CircularProgressMedium from "../../../All/UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import ClinicalNotesAttachments from "./ClinicalNotesAttachments";
import ClinicalNotesTemplates from "./ClinicalNotesTemplates";

const ClinicalNotesForm = ({
  setAddVisible,
  patientId,
  demographicsInfos,
  formRef,
  paging,
  setPaging,
  order,
}) => {
  //hooks
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    subject: "Clinical note",
    MyClinicalNotesContent: "",
    version_nbr: 1,
    attachments_ids: [],
  });
  const [attachments, setAttachments] = useState([]);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [templatesVisible, setTemplatesVisible] = useState(false);

  const [templates, setTemplates] = useFetchDatas(
    "/clinical_notes_templates",
    "staff"
  );

  useClinicalTemplatesSocket(templates, setTemplates);

  useEffect(() => {
    const retreiveClinicalNote = async () => {
      if (
        localStorage.getItem("currentClinicalNote") &&
        JSON.parse(localStorage.getItem("currentClinicalNote")).patient_id ===
          patientId
      ) {
        if (
          await confirmAlert({
            content:
              "You have an unsaved clinical note about this patient in memory, do you want to retreive it ?",
          })
        ) {
          setFormDatas(JSON.parse(localStorage.getItem("currentClinicalNote")));
        } else {
          localStorage.removeItem("currentClinicalNote");
        }
      }
    };
    retreiveClinicalNote();
  }, []);

  //HANDLERS
  const handleCancelClick = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to cancel ? Your changes won't be saved",
      })
    ) {
      localStorage.removeItem("currentClinicalNote");
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
        await postPatientRecord("/clinical_notes_attachments", user.id, {
          attachments_array: attachments,
        })
      ).data;

      await postPatientRecord(
        "/clinical_notes",
        user.id,
        {
          ...formDatas,
          attachments_ids: attach_ids,
          ParticipatingProviders: [
            {
              Name: {
                FirstName: staffIdToFirstName(staffInfos, user.id),
                LastName: staffIdToLastName(staffInfos, user.id),
              },
              OHIPPhysicianId: staffIdToOHIP(staffInfos, user.id),
              DateTimeNoteCreated: nowTZTimestamp(),
            },
          ],
        },
        socket,
        "CLINICAL NOTES"
      );
      setAddVisible(false);
      if (order === "desc") {
        setPaging({ ...paging, page: 1 });
      }
      localStorage.removeItem("currentClinicalNote");
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
        await postPatientRecord("/clinical_notes_attachments", user.id, {
          attachments_array: attachments,
        })
      ).data;

      await postPatientRecord(
        "/clinical_notes",
        user.id,

        {
          ...formDatas,
          attachments_ids: attach_ids,
          ParticipatingProviders: [
            {
              Name: {
                FirstName: staffIdToFirstName(staffInfos, user.id),
                LastName: staffIdToLastName(staffInfos, user.id),
              },
              OHIPPhysicianId: staffIdToOHIP(staffInfos, user.id),
              DateTimeNoteCreated: nowTZTimestamp(),
            },
          ],
        },
        socket,
        "CLINICAL NOTES"
      );
      setAddVisible(false);
      setPaging({ ...paging, page: 1 });
      localStorage.removeItem("currentClinicalNote");
      toast.success("Saved successfully", { containerId: "A" });
    } catch (err) {
      toast.error(`Error: unable to save clinical note: ${err.message}`, {
        containerId: "A",
      });
    }
    window.open(
      `/staff/billing/${patientId}/${toPatientName(demographicsInfos)}/${
        demographicsInfos.HealthCard?.Number
      }/${nowTZTimestamp()}`,
      "_blank"
    );
  };
  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
    localStorage.setItem(
      "currentClinicalNote",
      JSON.stringify({ ...formDatas, [name]: value })
    );
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

  const handleSelectTemplate = (e, templateId) => {
    setErrMsg("");
    setFormDatas({
      ...formDatas,
      MyClinicalNotesContent:
        formDatas.MyClinicalNotesContent +
        (formDatas.MyClinicalNotesContent ? "\n\n" : "") +
        templates.find(({ id }) => id === templateId)?.body,
    });
  };

  return (
    <>
      <form
        className="clinical-notes__form"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div className="clinical-notes__form-header">
          <div className="clinical-notes__form-row">
            <p>
              <strong>From: </strong>
              {staffIdToTitleAndName(staffInfos, user.id)}
            </p>
            <div className="clinical-notes__form-template">
              <label style={{ textDecoration: "underline", cursor: "pointer" }}>
                <strong onClick={() => setTemplatesVisible(true)}>
                  Use template
                </strong>
              </label>
              {templatesVisible && (
                <FakeWindow
                  title={`CHOOSE TEMPLATE(S)`}
                  width={500}
                  height={600}
                  x={window.innerWidth - 500}
                  y={0}
                  color="#93b5e9"
                  setPopUpVisible={setTemplatesVisible}
                >
                  <ClinicalNotesTemplates
                    templates={templates}
                    handleSelectTemplate={handleSelectTemplate}
                  />
                </FakeWindow>
              )}
            </div>
          </div>
          <div className="clinical-notes__form-row">
            <div className="clinical-notes__form-subject">
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
          {isLoadingFile && <CircularProgressMedium />}
        </div>
      </form>
    </>
  );
};

export default ClinicalNotesForm;
