import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { putPatientRecord } from "../../../../api/fetchRecords";
import useSocketContext from "../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";
import { firstLetterOfFirstWordUpper } from "../../../../utils/firstLetterUpper";
import { toLocalDateAndTime } from "../../../../utils/formatDates";
import { getResidualInfo } from "../../../../utils/getResidualInfo";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { getLastUpdate, isUpdated } from "../../../../utils/updates";
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
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [editVisible, setEditVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [formDatas, setFormDatas] = useState(null);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    if (topicDatas && topicDatas.length > 0) {
      setFormDatas({
        occupations: getResidualInfo("Occupations", topicDatas[0]),
        income: getResidualInfo("Income", topicDatas[0]),
        religion: getResidualInfo("Religion", topicDatas[0]),
        sexual_orientation: getResidualInfo("SexualOrientation", topicDatas[0]),
        special_diet: getResidualInfo("SpecialDiet", topicDatas[0]),
        smoking: getResidualInfo("Smoking", topicDatas[0]),
        alcohol: getResidualInfo("Alcohol", topicDatas[0]),
        recreational_drugs: getResidualInfo("RecreationalDrugs", topicDatas[0]),
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
      occupations: getResidualInfo("Occupations", topicDatas[0]),
      income: getResidualInfo("Income", topicDatas[0]),
      religion: getResidualInfo("Religion", topicDatas[0]),
      sexual_orientation: getResidualInfo("SexualOrientation", topicDatas[0]),
      special_diet: getResidualInfo("SpecialDiet", topicDatas[0]),
      smoking: getResidualInfo("Smoking", topicDatas[0]),
      alcohol: getResidualInfo("Alcohol", topicDatas[0]),
      recreational_drugs: getResidualInfo("RecreationalDrugs", topicDatas[0]),
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
          formDatas.occupations && {
            Name: "Occupations",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.occupations),
          },
          formDatas.income && {
            Name: "Income",
            DataType: "text",
            Content: formDatas.income,
          },
          formDatas.religion && {
            Name: "Religion",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.religion),
          },
          formDatas.sexual_orientation && {
            Name: "SexualOrientation",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.sexual_orientation),
          },
          formDatas.special_diet && {
            Name: "SpecialDiet",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.special_diet),
          },
          formDatas.smoking && {
            Name: "Smoking",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.smoking),
          },
          formDatas.alcohol && {
            Name: "Alcohol",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.alcohol),
          },
          formDatas.recreational_drugs && {
            Name: "RecreationalDrugs",
            DataType: "text",
            Content: firstLetterOfFirstWordUpper(formDatas.recreational_drugs),
          },
        ].filter((element) => element),
      },
    };
    try {
      setProgress(true);
      await putPatientRecord(
        `/personal_history/${topicDatas[0].id}`,
        user.id,
        datasToPut,
        socket,
        "PERSONAL HISTORY"
      );
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(
        `Error: unable to update patient social history: ${err.message}`,
        {
          containerId: "B",
        }
      );
      setProgress(false);
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
                    value={formDatas.occupations}
                    name="occupations"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.occupations
                )}
              </p>
              <p>
                <label>Income: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.income}
                    name="income"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.income
                )}
              </p>
              <p>
                <label>Religion: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.religion}
                    name="religion"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.religion
                )}
              </p>
              <p>
                <label>Sexual orientation: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.sexual_orientation}
                    name="sexual_orientation"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.sexual_orientation
                )}
              </p>
              <p>
                <label>Special diet: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.special_diet}
                    name="special_diet"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.special_diet
                )}
              </p>
              <p>
                <label>Smoking: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.smoking}
                    name="smoking"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.smoking
                )}
              </p>
              <p>
                <label>Alcohol: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.alcohol}
                    name="alcohol"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.alcohol
                )}
              </p>
              <p>
                <label>Recreational drugs: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.recreational_drugs}
                    name="recreational_drugs"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  formDatas.recreational_drugs
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
                    getLastUpdate(topicDatas[0]).updated_by_id
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
                    topicDatas[0].created_by_id
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
