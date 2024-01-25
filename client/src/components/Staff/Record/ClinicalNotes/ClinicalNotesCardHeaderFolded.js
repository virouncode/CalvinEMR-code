import React from "react";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDateAndTimeWithSeconds } from "../../../../utils/formatDates";
import {
  getLastUpdate,
  isUpdated,
} from "../../../../utils/socketHandlers/updates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import TriangleButtonProgress from "../Buttons/TriangleButtonProgress";

const ClinicalNotesCardHeaderFolded = ({
  tempFormDatas,
  handleTriangleProgressClick,
}) => {
  const { clinic } = useAuth();
  return (
    <div className="clinical-notes__card-header clinical-notes__card-header--folded">
      <div className="clinical-notes__card-header--folded-title">
        <label>
          <strong>From: </strong>
        </label>
        {staffIdToTitleAndName(
          clinic.staffInfos,
          isUpdated(tempFormDatas)
            ? getLastUpdate(tempFormDatas).updated_by_id
            : tempFormDatas.created_by_id,
          true
        )}
        {` ${toLocalDateAndTimeWithSeconds(
          isUpdated(tempFormDatas)
            ? getLastUpdate(tempFormDatas).date_updated
            : tempFormDatas.date_created
        )}`}
        {" / "}
        <label>
          <strong>Subject: </strong>
        </label>
        {tempFormDatas.subject}
      </div>
      <div>
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
