import React from "react";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import { timestampToDateTimeStrTZ } from "../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import TriangleButtonProgress from "../Buttons/TriangleButtonProgress";

const ClinicalNotesCardHeaderFolded = ({
  tempFormDatas,
  handleTriangleProgressClick,
  isChecked,
  clinicalNote,
  handleCheck,
}) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <div
      className="clinical-notes__card-header clinical-notes__card-header--folded"
      onClick={handleTriangleProgressClick}
    >
      <div className="clinical-notes__card-header--folded-title">
        <input
          className="clinical-notes__card-check"
          type="checkbox"
          checked={isChecked(clinicalNote.id)}
          onChange={handleCheck}
          onClick={(event) => event.stopPropagation()}
        />
        <p>
          <label>
            <strong>From: </strong>
          </label>
          {staffIdToTitleAndName(staffInfos, tempFormDatas.created_by_id)}
          {` ${timestampToDateTimeStrTZ(tempFormDatas.date_created)}`}
          {" / "}
          <strong>Subject: </strong>
          {tempFormDatas.subject}
        </p>
      </div>
      <div className="clinical-notes__card-header--folded-triangle">
        <TriangleButtonProgress
          handleTriangleClick={handleTriangleProgressClick}
          color="dark"
          className={"triangle-clinical-notes"}
        />
      </div>
    </div>
  );
};

export default ClinicalNotesCardHeaderFolded;
