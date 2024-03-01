import React from "react";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import { toLocalDateAndTimeWithSeconds } from "../../../../utils/formatDates";
import {
  getLastUpdate,
  isUpdated,
} from "../../../../utils/socketHandlers/updates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import ClinicalNotesAttachments from "./ClinicalNotesAttachments";

const ClinicalNotesCardPrint = ({ clinicalNote }) => {
  const { staffInfos } = useStaffInfosContext();

  //styles
  const BODY_STYLE = {
    padding: "10px",
    textAlign: "justify",
    whiteSpace: "pre",
  };
  const FOOTER_STYLE = {
    textAlign: "end",
    fontSize: "0.6rem",
    fontStyle: "italic",
  };

  return (
    <div
      className="clinical-notes__card clinical-notes__card--print"
      style={{ fontFamily: "sans-serif" }}
    >
      <div className="clinical-notes__card-header">
        <div className="clinical-notes__card-header-row">
          <p style={{ margin: "0", padding: "0" }}>
            <strong>From: </strong>
            {staffIdToTitleAndName(
              staffInfos,
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
        <p style={{ whiteSpace: "pre" }}>
          {clinicalNote.MyClinicalNotesContent}
        </p>
        <ClinicalNotesAttachments
          attachments={clinicalNote.attachments_ids
            .filter((item) => item)
            .map(({ attachments }) => attachments?.[0])}
          deletable={false}
          addable={false}
        />
        <div style={FOOTER_STYLE}>
          {isUpdated(clinicalNote) ? (
            <p style={{ padding: "0", margin: "0" }}>
              Updated by{" "}
              {staffIdToTitleAndName(
                staffInfos,
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
              staffInfos,
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
