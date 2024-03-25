import React from "react";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import { timestampToDateTimeSecondsStrTZ } from "../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";

const ClinicalNoteCardVersion = ({ version }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="clinical-notes__card">
      <div className="clinical-notes__card-header">
        <div className="clinical-notes__card-header-row">
          <p style={{ margin: "0", padding: "0" }}>
            <strong>From: </strong>
            {staffIdToTitleAndName(staffInfos, version.created_by_id)}
          </p>
          <p style={{ margin: "0", fontSize: "0.7rem", padding: "0" }}>
            Signed on{" "}
            {`${timestampToDateTimeSecondsStrTZ(
              version.date_updated || version.date_created
            )}`}
          </p>
        </div>
        <div className="clinical-notes__card-header-row">
          <div>
            <label>
              <strong>Subject: </strong>
            </label>
            {version.subject}
          </div>
          <div>
            <label>
              <strong>Version: </strong>
            </label>
            {"V" + version.version_nbr.toString()}
          </div>
        </div>
      </div>
      <div>
        <p style={{ whiteSpace: "pre-wrap", padding: "20px" }}>
          {version.MyClinicalNotesContent}
        </p>
        {/* <ClinicalNotesAttachments
            attachments={version.attachments_ids.map(
              ({ attachment }) => attachment
            )}
            deletable={false}
            addable={false}
          /> */}
        <div></div>
      </div>
    </div>
  );
};

export default ClinicalNoteCardVersion;
