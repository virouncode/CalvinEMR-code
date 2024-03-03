import React from "react";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import { toLocalDateAndTimeWithSeconds } from "../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";

const ClinicalNoteOverviewCard = ({ clinicalNote, lastItemRef = null }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="clinical-notes__overview-card" ref={lastItemRef}>
      <div className="clinical-notes__overview-card-row">
        <label>From:</label>
        <p>
          {staffIdToTitleAndName(staffInfos, clinicalNote.created_by_id, true)}
        </p>
      </div>
      <div className="clinical-notes__overview-card-row">
        <label>Date:</label>
        <p>{toLocalDateAndTimeWithSeconds(clinicalNote.date_created)}</p>
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
