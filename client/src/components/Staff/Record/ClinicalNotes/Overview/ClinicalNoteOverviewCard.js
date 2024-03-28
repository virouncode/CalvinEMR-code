import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import { timestampToDateTimeSecondsStrTZ } from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";

const ClinicalNoteOverviewCard = ({ clinicalNote, lastItemRef = null }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="clinical-notes__overview-card" ref={lastItemRef}>
      <div className="clinical-notes__overview-card-row">
        <label>From:</label>
        <p>{staffIdToTitleAndName(staffInfos, clinicalNote.created_by_id)}</p>
      </div>
      <div className="clinical-notes__overview-card-row">
        <label>Date:</label>
        <p>{timestampToDateTimeSecondsStrTZ(clinicalNote.date_created)}</p>
      </div>
      <div className="clinical-notes__overview-card-row">
        <label>Subject:</label>
        <p>{clinicalNote.subject}</p>
      </div>
      <div className="clinical-notes__overview-card-row">
        <label>Body:</label>
        <p>{clinicalNote.MyClinicalNotesContent}</p>
      </div>
    </div>
  );
};

export default ClinicalNoteOverviewCard;
