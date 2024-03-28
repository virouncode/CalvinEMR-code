import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import {
  timestampToDateTimeSecondsStrTZ,
  timestampToDateTimeStrTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import ClinicalNoteAttachments from "../Card/ClinicalNoteAttachments";

const ClinicalNoteCardPrint = ({ clinicalNote }) => {
  const { staffInfos } = useStaffInfosContext();

  return (
    <div className="clinical-notes__card clinical-notes__card--print">
      <div className="clinical-notes__card-header">
        <div className="clinical-notes__card-header-row">
          <p style={{ margin: "0", padding: "0" }}>
            <strong>From: </strong>
            {staffIdToTitleAndName(staffInfos, clinicalNote.created_by_id)}
            {` ${timestampToDateTimeStrTZ(clinicalNote.date_created)}`}
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
      <div className="clinical-notes__card-body">
        <p style={{ whiteSpace: "pre-wrap" }}>
          {clinicalNote.MyClinicalNotesContent}
        </p>
        <ClinicalNoteAttachments
          attachments={clinicalNote.attachments_ids.map(
            ({ attachment }) => attachment
          )}
          deletable={false}
          addable={false}
        />
      </div>
      <div className="clinical-notes__card-sign">
        <p style={{ padding: "0 10px" }}>
          Created by{" "}
          {staffIdToTitleAndName(staffInfos, clinicalNote.created_by_id)} on{" "}
          {timestampToDateTimeSecondsStrTZ(clinicalNote.date_created)}
        </p>
        {clinicalNote.date_updated && (
          <p style={{ padding: "0 10px" }}>
            Updated on{" "}
            {timestampToDateTimeSecondsStrTZ(clinicalNote.date_updated)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ClinicalNoteCardPrint;
