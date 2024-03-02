import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";
import { toLocalDateAndTimeWithSeconds } from "../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/toPatientName";
import TriangleButtonProgress from "../Buttons/TriangleButtonProgress";

const ClinicalNotesCardHeader = ({
  demographicsInfos,
  isChecked,
  handleCheck,
  clinicalNote,
  tempFormDatas,
  editVisible,
  versions,
  handleVersionChange,
  handleEditClick,
  handleCalvinAIClick,
  handleSaveClick,
  handleCancelClick,
  handleChange,
  handleTriangleProgressClick,
  choosenVersionNbr,
}) => {
  const { staffInfos } = useStaffInfosContext();
  const { user } = useUserContext();

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
              clinicalNote.created_by_id,
              true
            )}
            {` ${toLocalDateAndTimeWithSeconds(clinicalNote.date_created)}`}
          </p>
        </div>
        <div className="clinical-notes__card-version">
          <label>
            <strong style={{ marginRight: "5px" }}>Version: </strong>
          </label>
          {!editVisible ? (
            versions && (
              <select
                name="version_nbr"
                value={choosenVersionNbr}
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
            )
          ) : (
            <span style={{ marginRight: "10px", fontWeight: "bold" }}>{`V${
              versions.length + 2
            }`}</span>
          )}
          <div className="clinical-notes__card-btns">
            {!editVisible ? (
              <>
                <button
                  onClick={handleEditClick}
                  disabled={user.id !== clinicalNote.created_by_id}
                >
                  Edit
                </button>
                <button>
                  <a
                    href={`/staff/billing/${
                      demographicsInfos.patient_id
                    }/${toPatientName(demographicsInfos)}/${
                      demographicsInfos.HealthCard?.Number
                    }/${clinicalNote.date_created}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#FEFEFE" }}
                  >
                    Bill
                  </a>
                </button>
                <button onClick={handleCalvinAIClick}>CalvinAI</button>
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
        <div className="clinical-notes__card-triangle">
          <TriangleButtonProgress
            handleTriangleClick={handleTriangleProgressClick}
            color="dark"
            className={
              "triangle-clinical-notes  triangle-clinical-notes--active"
            }
          />
        </div>
      </div>
      <div className="clinical-notes__card-header-row">
        <div className="clinical-notes__card-subject">
          <label>
            <strong>Subject: </strong>
          </label>
          {!editVisible ? (
            clinicalNote.subject
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
      </div>
    </div>
  );
};

export default ClinicalNotesCardHeader;
