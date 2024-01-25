import React, { useEffect, useState } from "react";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDateAndTimeWithSeconds } from "../../../../utils/formatDates";
import {
  getLastUpdate,
  isUpdated,
} from "../../../../utils/socketHandlers/updates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import ClinicalNotesAttachments from "./ClinicalNotesAttachments";

const ClinicalNotesCardPrint = ({ clinicalNote }) => {
  const { auth, clinic } = useAuth();
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = (
        await axiosXanoStaff.post(
          "/attachments_for_clinical_note",
          { attachments_ids: clinicalNote.attachments_ids },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        )
      ).data;
      setAttachments(response);
    };
    fetchFiles();
  }, [auth.authToken, clinicalNote.attachments_ids]);

  //styles
  const BODY_STYLE = {
    padding: "10px",
    textAlign: "justify",
  };
  const FOOTER_STYLE = {
    textAlign: "end",
    fontSize: "0.6rem",
    fontStyle: "italic",
  };

  return (
    <div className="clinical-notes__card clinical-notes__card--print">
      <div className="clinical-notes__card-header">
        <div className="clinical-notes__card-header-row">
          <p style={{ margin: "0", padding: "0" }}>
            <strong>From: </strong>
            {staffIdToTitleAndName(
              clinic.staffInfos,
              isUpdated(clinicalNote)
                ? getLastUpdate(clinicalNote).updated_by_id
                : clinicalNote.created_by_id,
              true
            )}
          </p>
          <p style={{ margin: "0", fontSize: "0.7rem", padding: "0 5px" }}>
            Signed on{" "}
            {`${toLocalDateAndTimeWithSeconds(
              isUpdated(clinicalNote)
                ? getLastUpdate(clinicalNote).date_updated
                : clinicalNote.date_created
            )}`}
          </p>
        </div>
        <div className="clinical-notes__card-header-row">
          <div>
            <label>
              <strong>Subject: </strong>
            </label>
            {clinicalNote.subject}
          </div>
          <div>
            <label>
              <strong>Version: </strong>
            </label>
            {"V" + clinicalNote.version_nbr.toString()}
          </div>
        </div>
      </div>
      <div style={BODY_STYLE}>
        <p>{clinicalNote.MyClinicalNotesContent}</p>
        <ClinicalNotesAttachments
          attachments={attachments}
          deletable={false}
          addable={false}
        />
        <div style={FOOTER_STYLE}>
          {isUpdated(clinicalNote) ? (
            <p style={{ padding: "0", margin: "0" }}>
              Updated by{" "}
              {staffIdToTitleAndName(
                clinic.staffInfos,
                getLastUpdate(clinicalNote).updated_by_id,
                true
              )}{" "}
              on{" "}
              {toLocalDateAndTimeWithSeconds(
                getLastUpdate(clinicalNote).date_updated
              )}
            </p>
          ) : null}
          <p style={{ padding: "0", margin: "0" }}>
            Created by{" "}
            {staffIdToTitleAndName(
              clinic.staffInfos,
              clinicalNote.created_by_id,
              true
            )}{" "}
            on {toLocalDateAndTimeWithSeconds(clinicalNote.date_created)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClinicalNotesCardPrint;
