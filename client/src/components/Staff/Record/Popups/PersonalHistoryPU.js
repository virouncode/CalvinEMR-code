import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { putPatientRecord } from "../../../../api/fetchRecords";
import useAuthContext from "../../../../hooks/useAuthContext";
import useSocketContext from "../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";
import { firstLetterOfFirstWordUpper } from "../../../../utils/firstLetterUpper";
import { toLocalDateAndTime } from "../../../../utils/formatDates";
import { getResidualInfo } from "../../../../utils/getResidualInfo";
import {
  getLastUpdate,
  isUpdated,
} from "../../../../utils/socketHandlers/updates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { personalHistorySchema } from "../../../../validation/personalHistoryValidation";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import LoadingParagraph from "../../../All/UI/Tables/LoadingParagraph";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import PersonalHistoryForm from "../Topics/PersonalHistory/PersonalHistoryForm";

const PersonalHistoryPU = ({
  topicDatas,
  loading,
  errMsg,
  patientId,
  setPopUpVisible,
}) => {
  //HOOKS
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [editVisible, setEditVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [formDatas, setFormDatas] = useState(null);

  useEffect(() => {
    if (topicDatas && topicDatas.length > 0) {
      setFormDatas({
        Occupations: getResidualInfo("Occupations", topicDatas[0]),
        Income: getResidualInfo("Income", topicDatas[0]),
        Religion: getResidualInfo("Religion", topicDatas[0]),
        SexualOrientation: getResidualInfo("SexualOrientation", topicDatas[0]),
        SpecialDiet: getResidualInfo("SpecialDiet", topicDatas[0]),
        Smoking: getResidualInfo("Smoking", topicDatas[0]),
        Alcohol: getResidualInfo("Alcohol", topicDatas[0]),
        RecreationalDrugs: getResidualInfo("RecreationalDrugs", topicDatas[0]),
      });
    }
  }, [topicDatas]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleClose = async (e) => {
    if (!editVisible) {
      setPopUpVisible(false);
    } else if (
      editVisible &&
      (await confirmAlert({
        content:
          "Do you really want to close the window ? Your changes will be lost",
      }))
    ) {
      setPopUpVisible(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    setFormDatas({
      Occupations: getResidualInfo("Occupations", topicDatas[0]),
      Income: getResidualInfo("Income", topicDatas[0]),
      Religion: getResidualInfo("Religion", topicDatas[0]),
      SexualOrientation: getResidualInfo("SexualOrientation", topicDatas[0]),
      SpecialDiet: getResidualInfo("SpecialDiet", topicDatas[0]),
      Smoking: getResidualInfo("Smoking", topicDatas[0]),
      Alcohol: getResidualInfo("Alcohol", topicDatas[0]),
      RecreationalDrugs: getResidualInfo("RecreationalDrugs", topicDatas[0]),
    });
    setEditVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatasForValidation = { ...formDatas };
    //Validation
    try {
      await personalHistorySchema.validate(formDatasForValidation);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    //Formatting
    const datasToPut = {
      id: topicDatas[0].id,
      patient_id: topicDatas[0].patient_id,
      date_created: topicDatas[0].date_created,
      created_by_id: topicDatas[0].created_by_id,
      updates: topicDatas[0].updates,
      ResidualInfo: {
        DataElement: [
          {
            Name: "Occupations",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.Occupations),
          },
          { Name: "Income", DataType: "text", Content: formDatas.Income },
          {
            Name: "Religion",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.Religion),
          },
          {
            Name: "SexualOrientation",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.SexualOrientation),
          },
          {
            Name: "SpecialDiet",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.SpecialDiet),
          },
          {
            Name: "Smoking",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.Smoking),
          },
          {
            Name: "Alcohol",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.Alcohol),
          },
          {
            Name: "RecreationalDrugs",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.RecreationalDrugs),
          },
        ],
      },
    };
    try {
      await putPatientRecord(
        "/personal_history",
        topicDatas[0].id,
        user.id,
        auth.authToken,
        datasToPut,
        socket,
        "PERSONAL HISTORY"
      );
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(
        `Error: unable to update patient social history: ${err.message}`,
        {
          containerId: "B",
        }
      );
    }
  };

  return (
    <>
      <div className="personalhistory-card">
        <div className="personalhistory-card__header">
          <h1>
            Patient personal history{" "}
            <i className="fa-solid fa-champagne-glasses"></i>
          </h1>
        </div>
        {loading ? (
          <LoadingParagraph />
        ) : errMsg ? (
          <p className="personalhistory__err">{errMsg}</p>
        ) : formDatas ? (
          <>
            <form className="personalhistory-form">
              {errMsgPost && (
                <div className="personalhistory-form__err">{errMsgPost}</div>
              )}
              <p>
                <label>Occupations: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.Occupations}
                    name="Occupations"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.Occupations
                )}
              </p>
              <p>
                <label>Income: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.Income}
                    name="Income"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.Income
                )}
              </p>
              <p>
                <label>Religion: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.Religion}
                    name="Religion"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.Religion
                )}
              </p>
              <p>
                <label>Sexual orientation: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.SexualOrientation}
                    name="SexualOrientation"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.SexualOrientation
                )}
              </p>
              <p>
                <label>Special diet: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.SpecialDiet}
                    name="SpecialDiet"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.SpecialDiet
                )}
              </p>
              <p>
                <label>Smoking: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.Smoking}
                    name="Smoking"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.Smoking
                )}
              </p>
              <p>
                <label>Alcohol: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.Alcohol}
                    name="Alcohol"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.Alcohol
                )}
              </p>
              <p>
                <label>Recreational drugs: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.RecreationalDrugs}
                    name="RecreationalDrugs"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.RecreationalDrugs
                )}
              </p>
              <div className="personalhistory-card__btns">
                {!editVisible ? (
                  <>
                    <button onClick={(e) => setEditVisible((v) => !v)}>
                      Edit
                    </button>
                    <button onClick={handleClose}>Close</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={handleSubmit}>
                      Save
                    </button>
                    <button type="button" onClick={handleCancel}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
            <p className="personalhistory-card__sign">
              {isUpdated(topicDatas[0]) ? (
                <em>
                  Updated by{" "}
                  {staffIdToTitleAndName(
                    staffInfos,
                    getLastUpdate(topicDatas[0]).updated_by_id,
                    true
                  )}{" "}
                  on{" "}
                  {toLocalDateAndTime(
                    getLastUpdate(topicDatas[0]).date_updated
                  )}
                </em>
              ) : (
                <em>
                  Created by{" "}
                  {staffIdToTitleAndName(
                    staffInfos,
                    topicDatas[0].created_by_id,
                    true
                  )}{" "}
                  on {toLocalDateAndTime(topicDatas[0].date_created)}
                </em>
              )}
            </p>
          </>
        ) : (
          <PersonalHistoryForm
            setPopUpVisible={setPopUpVisible}
            patientId={patientId}
          />
        )}
        <ConfirmGlobal />
        <ToastCalvin id="B" />
      </div>
    </>
  );
};

export default PersonalHistoryPU;
