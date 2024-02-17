import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  postPatientRecord,
  putPatientRecord,
} from "../../../../api/fetchRecords";
import {
  toCodeTableName,
  ynIndicatorsimpleCT,
} from "../../../../datas/codesTables";
import useAuthContext from "../../../../hooks/useAuthContext";
import { toLocalDateAndTime } from "../../../../utils/formatDates";
import {
  bodyMassIndex,
  bodySurfaceArea,
  cmToFeet,
  feetToCm,
  kgToLbs,
  lbsToKg,
} from "../../../../utils/measurements";
import { patientIdToName } from "../../../../utils/patientIdToName";
import {
  getLastUpdate,
  isUpdated,
} from "../../../../utils/socketHandlers/updates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { careElementsSchema } from "../../../../validation/careElementsValidation";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../All/UI/Lists/GenericList";
import CircularProgressMedium from "../../../All/UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import CareElementHistory from "../Topics/CareElements/CareElementHistory";
var _ = require("lodash");

const CareElementsPU = ({
  patientId,
  setPopUpVisible,
  datas,
  isLoading,
  errMsg,
}) => {
  //HOOKS
  const { user, auth, socket, clinic } = useAuthContext();
  const [errMsgPost, setErrMsgPost] = useState("");
  const editCounter = useRef(0);
  const [editVisible, setEditVisible] = useState(false);
  const [historyTopic, setHistoryTopic] = useState("");
  const [historyDatas, setHistoryDatas] = useState([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [lastDatas, setLastDatas] = useState({
    patient_id: parseInt(patientId),
    SmokingStatus: { Status: "", Date: "" },
    SmokingPacks: { PerDay: "", Date: "" },
    Weight: { Weight: "", WeightUnit: "kg", Date: "" },
    WeightLbs: "",
    Height: { Height: "", HeightUnit: "cm", Date: "" },
    HeightFeet: "",
    WaistCircumference: {
      WaistCircumference: "",
      WaistCircumferenceUnit: "cm",
      Date: "",
    },
    BloodPressure: {
      SystolicBP: "",
      DiastolicBP: "",
      BPUnit: "mmHg",
      Date: "",
    },
    bodyMassIndex: { BMI: "", Date: "" },
    bodySurfaceArea: { BSA: "", Date: "" },
  });
  const [formDatas, setFormDatas] = useState({
    patient_id: parseInt(patientId),
    SmokingStatus: { Status: "", Date: "" },
    SmokingPacks: { PerDay: "", Date: "" },
    Weight: { Weight: "", WeightUnit: "kg", Date: "" },
    WeightLbs: "",
    Height: { Height: "", HeightUnit: "cm", Date: "" },
    HeightFeet: "",
    WaistCircumference: {
      WaistCircumference: "",
      WaistCircumferenceUnit: "cm",
      Date: "",
    },
    BloodPressure: {
      SystolicBP: "",
      DiastolicBP: "",
      BPUnit: "mmHg",
      Date: "",
    },
    bodyMassIndex: { BMI: "", Date: "" },
    bodySurfaceArea: { BSA: "", Date: "" },
  });

  useEffect(() => {
    //datas[0] is the CareElements for patient
    if (datas && datas.length > 0) {
      //if there is already a CareElement record for patient, we get the last datas, else we have an empty object
      const initialLastDatas = {
        patient_id: parseInt(patientId),
        SmokingStatus: datas[0].SmokingStatus.sort(
          (a, b) => b.Date - a.Date
        )[0],
        SmokingPacks: datas[0].SmokingPacks.sort((a, b) => b.Date - a.Date)[0],
        Weight: datas[0].Weight.sort((a, b) => b.Date - a.Date)[0],
        Height: datas[0].Height.sort((a, b) => b.Date - a.Date)[0],
        WaistCircumference: datas[0].WaistCircumference.sort(
          (a, b) => b.Date - a.Date
        )[0],
        BloodPressure: datas[0].BloodPressure.sort(
          (a, b) => b.Date - a.Date
        )[0],
        bodyMassIndex: datas[0].bodyMassIndex.sort(
          (a, b) => b.Date - a.Date
        )[0],
        bodySurfaceArea: datas[0].bodySurfaceArea.sort(
          (a, b) => b.Date - a.Date
        )[0],
      };
      setFormDatas(initialLastDatas);
      setLastDatas(initialLastDatas);
    }
  }, [datas, patientId]);

  //HANDLERS
  const handleClose = async (e) => {
    if (
      editCounter.current === 0 ||
      (editCounter.current > 0 &&
        (await confirmAlert({
          content:
            "Do you really want to close the window ? Your changes will be lost",
        })))
    ) {
      setPopUpVisible(false);
    }
  };

  const handleCancel = (e) => {
    setErrMsgPost("");
    setFormDatas(lastDatas);
    setEditVisible(false);
  };

  const handleEdit = (e) => {
    editCounter.current += 1;
    setEditVisible(true);
  };
  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "SmokingStatus":
        setFormDatas({
          ...formDatas,
          SmokingStatus: { Status: value, Date: Date.now() },
          SmokingPacks:
            value === "N"
              ? { PerDay: 0, Date: Date.now() }
              : { PerDay: "", Date: Date.now() },
        });
        break;
      case "SmokingPacks":
        setFormDatas({
          ...formDatas,
          SmokingStatus: {
            Status: Number(value) ? "Y" : "N",
            Date: Date.now(),
          },
          SmokingPacks: { PerDay: value, Date: Date.now() },
        });
        break;
      case "Weight":
        setFormDatas({
          ...formDatas,
          Weight: { Weight: value, WeightUnit: "kg", Date: Date.now() },
          WeightLbs: kgToLbs(value),
          bodyMassIndex: {
            BMI: bodyMassIndex(formDatas.Height.Height, value),
            Date: Date.now(),
          },
          bodySurfaceArea: {
            BSA: bodySurfaceArea(formDatas.Height.Height, value),
            Date: Date.now(),
          },
        });
        break;
      case "WeightLbs":
        setFormDatas({
          ...formDatas,
          Weight: {
            Weight: lbsToKg(value),
            WeightUnit: "kg",
            Date: Date.now(),
          },
          WeightLbs: value,
          bodyMassIndex: {
            BMI: bodyMassIndex(formDatas.Height.Height, lbsToKg(value)),
            Date: Date.now(),
          },
          bodySurfaceArea: {
            BSA: bodySurfaceArea(formDatas.Height.Height, lbsToKg(value)),
            Date: Date.now(),
          },
        });
        break;
      case "Height":
        setFormDatas({
          ...formDatas,
          Height: { Height: value, HeightUnit: "cm", Date: Date.now() },
          HeightFeet: cmToFeet(value),
          bodyMassIndex: {
            BMI: bodyMassIndex(value, formDatas.Weight.Weight),
            Date: Date.now(),
          },
          bodySurfaceArea: {
            BSA: bodySurfaceArea(value, formDatas.Weight.Weight),
            Date: Date.now(),
          },
        });
        break;
      case "HeightFeet":
        setFormDatas({
          ...formDatas,
          Height: {
            Height: feetToCm(value),
            HeightUnit: "cm",
            Date: Date.now(),
          },
          HeightFeet: value,
          bodyMassIndex: {
            BMI: bodyMassIndex(feetToCm(value), formDatas.Weight.Weight),
            Date: Date.now(),
          },
          bodySurfaceArea: {
            BSA: bodySurfaceArea(feetToCm(value), formDatas.Weight.Weight),
            Date: Date.now(),
          },
        });
        break;
      case "WaistCircumference":
        setFormDatas({
          ...formDatas,
          WaistCircumference: {
            WaistCircumference: value,
            WaistCircumferenceUnit: "cm",
            Date: Date.now(),
          },
        });
        break;
      case "SystolicBP":
        setFormDatas({
          ...formDatas,
          BloodPressure: {
            ...formDatas.BloodPressure,
            SystolicBP: value,
            Date: Date.now(),
          },
        });
        break;
      case "DiastolicBP":
        setFormDatas({
          ...formDatas,
          BloodPressure: {
            ...formDatas.BloodPressure,
            DiastolicBP: value,
            Date: Date.now(),
          },
        });
        break;
      default:
        break;
    }
  };
  const handleSubmit = async (e) => {
    //Validating
    try {
      await careElementsSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    if (
      formDatas.SmokingStatus.Status === "Y" &&
      !formDatas.SmokingPacks.PerDay
    ) {
      setErrMsgPost("Smoking Packs field is required");
      return;
    }

    if (datas.length === 0) {
      //We create a Care Element
      const datasToPost = {
        patient_id: patientId,
        SmokingStatus: formDatas.SmokingStatus.Status
          ? [formDatas.SmokingStatus]
          : [],
        SmokingPacks: formDatas.SmokingPacks.PerDay
          ? [formDatas.SmokingPacks]
          : [],
        Weight: formDatas.Weight.Weight ? [formDatas.Weight] : [],
        Height: formDatas.Height.Height ? [formDatas.Height] : [],
        WaistCircumference: formDatas.WaistCircumference.WaistCircumference
          ? [formDatas.WaistCircumference]
          : [],
        BloodPressure: formDatas.BloodPressure.Date
          ? [formDatas.BloodPressure]
          : [],
        bodyMassIndex: formDatas.bodyMassIndex.BMI
          ? [formDatas.bodyMassIndex]
          : [],
        bodySurfaceArea: formDatas.bodySurfaceArea.BSA
          ? [formDatas.bodySurfaceArea]
          : [],
      };

      try {
        //Validating
        await postPatientRecord(
          "/care_elements",
          user.id,
          auth.authToken,
          datasToPost,
          socket,
          "CARE ELEMENTS"
        );
        setErrMsgPost("");
        setEditVisible(false);
        editCounter.current -= 1;
        toast.success("Saved successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error: unable to save care elements: ${err.message}`, {
          containerId: "B",
        });
      }
    } else {
      if (_.isEqual(formDatas, lastDatas)) {
        //If we didn't change anything
        return;
      }
      //add a new element to each array if value different from last datas
      const datasToPut = {
        id: datas[0].id,
        patient_id: parseInt(patientId),
        date_created: datas[0].date_created,
        created_by_id: datas[0].created_by_id,
        updates: datas[0].updates,
        SmokingStatus:
          formDatas.SmokingStatus?.Status !== lastDatas.SmokingStatus?.Status
            ? [...datas[0].SmokingStatus, formDatas.SmokingStatus]
            : [...datas[0].SmokingStatus],
        SmokingPacks:
          formDatas.SmokingPacks?.PerDay !== lastDatas.SmokingPacks?.PerDay
            ? [...datas[0].SmokingPacks, formDatas.SmokingPacks]
            : [...datas[0].SmokingPacks],
        Weight:
          formDatas.Weight?.Weight !== lastDatas.Weight?.Weight
            ? [...datas[0].Weight, formDatas.Weight]
            : [...datas[0].Weight],
        Height:
          formDatas.Height?.Height !== lastDatas.Height?.Height
            ? [...datas[0].Height, formDatas.Height]
            : [...datas[0].Height],
        WaistCircumference:
          formDatas.WaistCircumference?.WaistCircumference !==
          lastDatas.WaistCircumference?.WaistCircumference
            ? [...datas[0].WaistCircumference, formDatas.WaistCircumference]
            : [...datas[0].WaistCircumference],
        BloodPressure:
          formDatas.BloodPressure?.SystolicBP !==
            lastDatas.BloodPressure?.SystolicBP ||
          formDatas.BloodPressure?.DiastolicBP !==
            lastDatas.BloodPressure?.DiastolicBP
            ? [...datas[0].BloodPressure, formDatas.BloodPressure]
            : [...datas[0].BloodPressure],
        bodyMassIndex:
          formDatas.bodyMassIndex?.BMI !== lastDatas.bodyMassIndex?.BMI
            ? [...datas[0].bodyMassIndex, formDatas.bodyMassIndex]
            : [...datas[0].bodyMassIndex],
        bodySurfaceArea:
          formDatas.bodySurfaceArea?.BSA !== lastDatas.bodySurfaceArea?.BSA
            ? [...datas[0].bodySurfaceArea, formDatas.bodySurfaceArea]
            : [...datas[0].bodySurfaceArea],
      };
      try {
        //Validating
        await putPatientRecord(
          "/care_elements",
          datas[0].id,
          user.id,
          auth.authToken,
          datasToPut,
          socket,
          "CARE ELEMENTS"
        );
        setErrMsgPost("");
        setEditVisible(false);
        editCounter.current -= 1;
        toast.success("Saved successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error: unable to save care elements: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };
  const handleClickHistory = (e, row) => {
    setHistoryTopic(row);
    let historyDatasToPass = [];
    switch (row) {
      case "SMOKING STATUS":
        historyDatasToPass = datas.length
          ? datas[0].SmokingStatus?.length
            ? datas[0].SmokingStatus.sort((a, b) => a.Date - b.Date)
            : []
          : [];
        break;
      case "SMOKING PACKS PER DAY":
        historyDatasToPass = datas.length
          ? datas[0].SmokingPacks?.length
            ? datas[0].SmokingPacks.sort((a, b) => a.Date - b.Date)
            : []
          : [];
        break;
      case "WEIGHT":
        historyDatasToPass = datas.length
          ? datas[0].Weight?.length
            ? datas[0].Weight.sort((a, b) => a.Date - b.Date)
            : []
          : [];
        break;
      case "HEIGHT":
        historyDatasToPass = datas.length
          ? datas[0].Height?.length
            ? datas[0].Height.sort((a, b) => a.Date - b.Date)
            : []
          : [];
        break;
      case "WAIST CIRCUMFERENCE":
        historyDatasToPass = datas.length
          ? datas[0].WaistCircumference?.length
            ? datas[0].WaistCircumference.sort((a, b) => a.Date - b.Date)
            : []
          : [];
        break;
      case "BLOOD PRESSURE":
        historyDatasToPass = datas.length
          ? datas[0].BloodPressure?.length
            ? datas[0].BloodPressure.sort((a, b) => a.Date - b.Date)
            : []
          : [];
        break;
      case "BODY MASS INDEX":
        historyDatasToPass = datas.length
          ? datas[0].bodyMassIndex?.length
            ? datas[0].bodyMassIndex.sort((a, b) => a.Date - b.Date)
            : []
          : [];
        break;
      case "BODY SURFACE AREA":
        historyDatasToPass = datas.length
          ? datas[0].bodySurfaceArea?.length
            ? datas[0].bodySurfaceArea.sort((a, b) => a.Date - b.Date)
            : []
          : [];
        break;
      default:
        break;
    }
    setHistoryDatas(historyDatasToPass);
    setHistoryVisible(true);
  };

  return (
    <>
      <h1 className="care-elements__title">
        Patient care elements <i className="fa-solid fa-ruler-combined"></i>
      </h1>
      {errMsgPost && <div className="care-elements__err">{errMsgPost}</div>}
      {isLoading ? (
        <CircularProgressMedium />
      ) : errMsg ? (
        <p className="care-elements__err">{errMsg}</p>
      ) : (
        datas && (
          <>
            <div
              className="care-elements__card"
              style={{ border: errMsgPost && "solid 1.5px red" }}
            >
              <div className="care-elements__row care-elements__row--title">
                <span>Last informations</span>
                <div className="care-elements__btn-container">
                  {!editVisible ? (
                    <>
                      <button onClick={handleEdit}>Edit</button>
                      <button onClick={handleClose}>Close</button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleSubmit}>Save</button>
                      <button type="button" onClick={handleCancel}>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="care-elements__row">
                <label>Smoking:</label>
                {/* </Tooltip> */}
                {editVisible ? (
                  <GenericList
                    list={ynIndicatorsimpleCT}
                    name="SmokingStatus"
                    handleChange={handleChange}
                    value={formDatas.SmokingStatus?.Status}
                  />
                ) : (
                  <div>
                    <span className="care-elements__value">
                      {toCodeTableName(
                        ynIndicatorsimpleCT,
                        formDatas.SmokingStatus?.Status
                      )}
                    </span>
                    <span className="care-elements__history">
                      <i
                        className="fa-solid fa-clock-rotate-left"
                        onClick={(e) => handleClickHistory(e, "SMOKING STATUS")}
                      ></i>
                    </span>
                  </div>
                )}
              </div>
              <div className="care-elements__row">
                <label>Smoking Packs (per day):</label>
                {/* </Tooltip> */}
                {editVisible ? (
                  <input
                    type="text"
                    name="SmokingPacks"
                    onChange={handleChange}
                    value={formDatas.SmokingPacks?.PerDay}
                    autoComplete="off"
                  />
                ) : (
                  <div>
                    <span className="care-elements__value">
                      {formDatas.SmokingPacks?.PerDay}
                    </span>
                    <span className="care-elements__history">
                      <i
                        className="fa-solid fa-clock-rotate-left"
                        onClick={(e) =>
                          handleClickHistory(e, "SMOKING PACKS PER DAY")
                        }
                      ></i>
                    </span>
                  </div>
                )}
              </div>
              <div className="care-elements__row">
                <label>Weight (kg):</label>
                {/* </Tooltip> */}
                {editVisible ? (
                  <input
                    type="text"
                    name="Weight"
                    onChange={handleChange}
                    value={formDatas.Weight?.Weight}
                    autoComplete="off"
                  />
                ) : (
                  <div>
                    <span className="care-elements__value">
                      {formDatas.Weight?.Weight}
                    </span>
                    <span className="care-elements__history">
                      <i
                        className="fa-solid fa-clock-rotate-left"
                        onClick={(e) => handleClickHistory(e, "WEIGHT")}
                      ></i>
                    </span>
                  </div>
                )}
              </div>
              <div className="care-elements__row">
                <label>Weight (lbs):</label>
                {editVisible ? (
                  <input
                    type="text"
                    name="WeightLbs"
                    onChange={handleChange}
                    value={formDatas.WeightLbs}
                    autoComplete="off"
                  />
                ) : (
                  <div>
                    <span className="care-elements__value">
                      {kgToLbs(formDatas.Weight?.Weight)}
                    </span>
                    <span className="care-elements__history">
                      <i
                        className="fa-solid fa-clock-rotate-left"
                        onClick={(e) => handleClickHistory(e, "WEIGHT")}
                      ></i>
                    </span>
                  </div>
                )}
              </div>
              <div className="care-elements__row">
                <label>Height (cm):</label>
                {/* </Tooltip> */}
                {editVisible ? (
                  <input
                    type="text"
                    name="Height"
                    onChange={handleChange}
                    value={formDatas.Height?.Height}
                    autoComplete="off"
                  />
                ) : (
                  <div>
                    <span className="care-elements__value">
                      {formDatas.Height?.Height}
                    </span>
                    <span className="care-elements__history">
                      <i
                        className="fa-solid fa-clock-rotate-left"
                        onClick={(e) => handleClickHistory(e, "HEIGHT")}
                      ></i>
                    </span>
                  </div>
                )}
              </div>
              <div className="care-elements__row">
                <label>Height (feet):</label>
                {/* </Tooltip> */}
                {editVisible ? (
                  <input
                    type="text"
                    name="HeightFeet"
                    onChange={handleChange}
                    value={formDatas.HeightFeet}
                    autoComplete="off"
                  />
                ) : (
                  <div>
                    <span className="care-elements__value">
                      {cmToFeet(formDatas.Height?.Height)}
                    </span>
                    <span className="care-elements__history">
                      <i
                        className="fa-solid fa-clock-rotate-left"
                        onClick={(e) => handleClickHistory(e, "HEIGHT")}
                      ></i>
                    </span>
                  </div>
                )}
              </div>
              <div className="care-elements__row">
                <label>Body Mass Index (kg/m2):</label>
                {editVisible ? (
                  <input
                    type="text"
                    name="bodyMassIndex"
                    readOnly
                    value={formDatas.bodyMassIndex?.BMI}
                    autoComplete="off"
                  />
                ) : (
                  <div>
                    <span className="care-elements__value">
                      {formDatas.bodyMassIndex?.BMI}
                    </span>
                    <span className="care-elements__history">
                      <i
                        className="fa-solid fa-clock-rotate-left"
                        onClick={(e) =>
                          handleClickHistory(e, "BODY MASS INDEX")
                        }
                      ></i>
                    </span>
                  </div>
                )}
              </div>
              <div className="care-elements__row">
                <label>Body Surface Area (m2):</label>
                {/* </Tooltip> */}
                {editVisible ? (
                  <input
                    type="text"
                    name="bodySurfaceArea"
                    readOnly
                    value={formDatas.bodySurfaceArea?.BSA}
                    autoComplete="off"
                  />
                ) : (
                  <div>
                    <span className="care-elements__value">
                      {formDatas.bodySurfaceArea?.BSA}
                    </span>
                    <span className="care-elements__history">
                      <i
                        className="fa-solid fa-clock-rotate-left"
                        onClick={(e) =>
                          handleClickHistory(e, "BODY SURFACE AREA")
                        }
                      ></i>
                    </span>
                  </div>
                )}
              </div>
              <div className="care-elements__row">
                <label>Waist Circumference (cm):</label>
                {editVisible ? (
                  <input
                    type="text"
                    name="WaistCircumference"
                    value={formDatas.WaistCircumference?.WaistCircumference}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                ) : (
                  <div>
                    <span className="care-elements__value">
                      {formDatas.WaistCircumference?.WaistCircumference}
                    </span>
                    <span className="care-elements__history">
                      <i
                        className="fa-solid fa-clock-rotate-left"
                        onClick={(e) =>
                          handleClickHistory(e, "WAIST CIRCUMFERENCE")
                        }
                      ></i>
                    </span>
                  </div>
                )}
              </div>
              <div className="care-elements__row">
                <label>Systolic (mmHg):</label>
                {/* </Tooltip> */}
                {editVisible ? (
                  <input
                    type="text"
                    name="SystolicBP"
                    autoComplete="off"
                    value={formDatas.BloodPressure?.SystolicBP}
                    onChange={handleChange}
                  />
                ) : (
                  <div>
                    <span className="care-elements__value">
                      {formDatas.BloodPressure?.SystolicBP}
                    </span>
                    <span className="care-elements__history">
                      <i
                        className="fa-solid fa-clock-rotate-left"
                        onClick={(e) => handleClickHistory(e, "BLOOD PRESSURE")}
                      ></i>
                    </span>
                  </div>
                )}
              </div>
              <div className="care-elements__row">
                <label>Diastolic (mmHg):</label>
                {/* </Tooltip> */}
                {editVisible ? (
                  <input
                    type="text"
                    name="DiastolicBP"
                    value={formDatas.BloodPressure?.DiastolicBP}
                    autoComplete="off"
                    onChange={handleChange}
                  />
                ) : (
                  <div>
                    <span className="care-elements__value">
                      {formDatas.BloodPressure?.DiastolicBP}
                    </span>
                    <span className="care-elements__history">
                      <i
                        className="fa-solid fa-clock-rotate-left"
                        onClick={(e) => handleClickHistory(e, "BLOOD PRESSURE")}
                      ></i>
                    </span>
                  </div>
                )}
              </div>
              <p className="care-elements__sign">
                {datas && datas.length > 0 && isUpdated(datas[0]) ? (
                  <em>
                    Updated by{" "}
                    {staffIdToTitleAndName(
                      clinic.staffInfos,
                      getLastUpdate(datas[0]).updated_by_id,
                      true
                    )}{" "}
                    on{" "}
                    {toLocalDateAndTime(getLastUpdate(datas[0]).date_updated)}
                  </em>
                ) : (
                  datas &&
                  datas.length > 0 && (
                    <em>
                      Created by{" "}
                      {staffIdToTitleAndName(
                        clinic.staffInfos,
                        datas[0].created_by_id,
                        true
                      )}{" "}
                      on {toLocalDateAndTime(datas[0].date_created)}
                    </em>
                  )
                )}
              </p>
            </div>
          </>
        )
      )}
      {historyVisible && (
        <FakeWindow
          title={`${historyTopic} HISTORY of ${patientIdToName(
            clinic.demographicsInfos,
            patientId
          )}`}
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#495867"
          setPopUpVisible={setHistoryVisible}
        >
          <CareElementHistory
            historyTopic={historyTopic}
            historyDatas={historyDatas}
          />
        </FakeWindow>
      )}
      <ConfirmGlobal isPopUp={true} />
      <ToastContainer
        enableMultiContainer
        containerId={"B"}
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
    </>
  );
};

export default CareElementsPU;
