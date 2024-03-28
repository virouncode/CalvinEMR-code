import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { timestampToDateTimeStrTZ } from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import TriangleClinicalButton from "../../../../UI/Buttons/TriangleClinicalButton";

const ClinicalNoteCardHeader = ({
  demographicsInfos,
  isChecked,
  handleCheck,
  clinicalNote,
  tempFormDatas,
  setTemplatesVisible,
  editVisible,
  versions,
  handleClickVersions,
  handleEditClick,
  handleCalvinAIClick,
  handleSaveClick,
  handleCancelClick,
  handleChange,
  handleTriangleClinicalClick,
}) => {
  const { staffInfos } = useStaffInfosContext();
  const { user } = useUserContext();

  const handleClickTemplate = (e) => {
    e.stopPropagation();
    setTemplatesVisible((v) => !v);
  };

  return (
    <div
      className="clinical-notes__card-header"
      onClick={handleTriangleClinicalClick}
    >
      <div className="clinical-notes__card-header-row">
        <div className="clinical-notes__card-author">
          <input
            className="clinical-notes__card-check"
            type="checkbox"
            checked={isChecked(clinicalNote.id)}
            onChange={handleCheck}
            onClick={(event) => event.stopPropagation()}
          />
          <p>
            <strong>From: </strong>
            {staffIdToTitleAndName(staffInfos, clinicalNote.created_by_id)}
            {` ${timestampToDateTimeStrTZ(clinicalNote.date_created)}`}
          </p>
        </div>
        <div className="clinical-notes__card-version">
          <label>
            <strong style={{ marginRight: "5px" }}>Version: </strong>
          </label>
          {!editVisible ? (
            versions && (
              <span
                onClick={handleClickVersions}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {"V" + (versions.length + 1).toString()}
              </span>
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
                <button onClick={(e) => e.stopPropagation()}>
                  <a
                    href={`/staff/billing/${
                      demographicsInfos.patient_id
                    }/${toPatientName(demographicsInfos)}/${
                      demographicsInfos.HealthCard?.Number
                    }/${clinicalNote.date_created}`}
                    rel="noreferrer"
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
          <TriangleClinicalButton
            handleTriangleClick={handleTriangleClinicalClick}
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
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
        {editVisible && (
          <div className="clinical-notes__form-template">
            <label style={{ textDecoration: "underline", cursor: "pointer" }}>
              <strong onClick={handleClickTemplate}>Use template</strong>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalNoteCardHeader;
