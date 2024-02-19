import { CircularProgress } from "@mui/material";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import { toLocalDateAndTimeWithSeconds } from "../../../../utils/formatDates";
import {
  getLastUpdate,
  isUpdated,
} from "../../../../utils/socketHandlers/updates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import TriangleButtonProgress from "../Buttons/TriangleButtonProgress";

const ClinicalNotesCardHeader = ({
  demographicsInfos,
  isChecked,
  handleCheck,
  clinicalNote,
  tempFormDatas,
  editVisible,
  versions,
  versionsLoading,
  handleVersionChange,
  handleEditClick,
  handleCalvinAIClick,
  handleSaveClick,
  handleCancelClick,
  handleChange,
  handleTriangleProgressClick,
}) => {
  const { staffInfos } = useStaffInfosContext();

  return (
    <div className="clinical-notes__card-header">
      <div className="clinical-notes__card-header-row">
        <div className="clinical-notes__card-author">
          <input
            className="clinical-notes__card-check"
            type="checkbox"
            checked={isChecked(clinicalNote.id)}
            onChange={handleCheck}
          />
          <p>
            <strong>From: </strong>
            {staffIdToTitleAndName(
              staffInfos,
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
          </p>
        </div>
        <div className="clinical-notes__card-version">
          <label>
            <strong style={{ marginRight: "5px" }}>Version: </strong>
          </label>
          {!editVisible ? (
            !versionsLoading ? (
              <select
                name="version_nbr"
                value={tempFormDatas.version_nbr.toString()}
                onChange={handleVersionChange}
              >
                {versions.map(({ version_nbr }) => (
                  <option value={version_nbr.toString()} key={version_nbr}>
                    {"V" + version_nbr.toString()}
                  </option>
                ))}
                <option value={(versions.length + 1).toString()}>
                  {"V" + (versions.length + 1).toString()}
                </option>
              </select>
            ) : (
              <CircularProgress size="0.8rem" style={{ margin: "5px" }} />
            )
          ) : (
            <span style={{ marginRight: "10px" }}>{`V${
              versions.length + 2
            }`}</span>
          )}
          <div className="clinical-notes__card-btns">
            {!editVisible ? (
              <>
                <button onClick={handleEditClick} disabled={versionsLoading}>
                  Edit
                </button>
                <button disabled={versionsLoading}>
                  <a
                    href={`/staff/billing/${demographicsInfos.patient_id}/${
                      demographicsInfos.HealthCard?.Number
                    }/${
                      isUpdated(clinicalNote)
                        ? getLastUpdate(clinicalNote).date_updated
                        : clinicalNote.date_created
                    }`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#FEFEFE" }}
                  >
                    Bill
                  </a>
                </button>
                <button
                  onClick={handleCalvinAIClick}
                  disabled={versionsLoading}
                >
                  CalvinAI
                </button>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button style={{ margin: "0 2px" }} onClick={handleSaveClick}>
                  Save
                </button>
                <button style={{ margin: "0 2px" }} onClick={handleCancelClick}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="clinical-notes__card-header-row">
        <div className="clinical-notes__card-subject">
          <label>
            <strong>Subject: </strong>
          </label>
          {!editVisible ? (
            tempFormDatas.subject
          ) : (
            <input
              type="text"
              value={tempFormDatas.subject}
              onChange={handleChange}
              name="subject"
              autoComplete="off"
            />
          )}
        </div>
        <div>
          <TriangleButtonProgress
            handleTriangleClick={handleTriangleProgressClick}
            color="dark"
            className={
              "triangle-clinical-notes  triangle-clinical-notes--active"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ClinicalNotesCardHeader;
