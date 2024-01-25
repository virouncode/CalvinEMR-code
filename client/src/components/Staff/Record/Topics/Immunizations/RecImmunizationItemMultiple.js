import React, { useState } from "react";
import { toLocalDate } from "../../../../../utils/formatDates";
import FakeWindow from "../../../../All/UI/Windows/FakeWindow";
import RecImmunizationFormMultiple from "./RecImmunizationFormMultiple";
import RecImmunizationHistory from "./RecImmunizationHistory";

const RecImmunizationItemMultiple = ({
  age,
  type,
  route,
  immunizationInfos,
  demographicsInfos,
  patientId,
}) => {
  const [formVisible, setFormVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  const handleAddClick = (e) => {
    setErrMsgPost("");
    setFormVisible((v) => !v);
  };

  const handleHistoryClick = () => {
    setErrMsgPost("");
    setHistoryVisible((v) => !v);
  };

  return (
    <div className="recimmunizations-item__cell">
      {type === "Inf" ? (
        <label>
          Every year in the fall{" "}
          {immunizationInfos.length
            ? `(last : ${toLocalDate(
                immunizationInfos.sort((a, b) => a.Date - b.Date).slice(-1)[0]
                  .Date
              )})`
            : ""}{" "}
        </label>
      ) : type === "Tdap_pregnancy" ? (
        <label>
          One dose in every pregnancy, ideally between 27-32 weeks of gestation{" "}
          {immunizationInfos.length
            ? `(last : ${toLocalDate(
                immunizationInfos.sort((a, b) => a.Date - b.Date).slice(-1)[0]
                  .Date
              )})`
            : ""}{" "}
        </label>
      ) : (
        <label>
          Every ten years <br />{" "}
          {immunizationInfos.length
            ? `(last : ${toLocalDate(
                immunizationInfos.sort((a, b) => a.Date - b.Date).slice(-1)[0]
                  .Date
              )})`
            : ""}{" "}
        </label>
      )}
      <button
        type="button"
        onClick={handleAddClick}
        className="recimmunizations-item__cell-multiple-btn"
      >
        {"+"}
      </button>
      <button
        type="button"
        onClick={handleHistoryClick}
        className="recimmunizations-item__cell-multiple-btn"
      >
        {"..."}
      </button>
      {formVisible && (
        <FakeWindow
          title={`NEW IMMUNIZATION (${type})`}
          width={700}
          height={600}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#931621"
          setPopUpVisible={setFormVisible}
        >
          <RecImmunizationFormMultiple
            setFormVisible={setFormVisible}
            immunizationInfos={immunizationInfos}
            type={type}
            age={age}
            errMsgPost={errMsgPost}
            setErrMsgPost={setErrMsgPost}
            route={route}
            patientId={patientId}
          />
        </FakeWindow>
      )}
      {historyVisible && (
        <FakeWindow
          title={`${type} IMMUNIZATION HISTORY`}
          width={700}
          height={300}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 300) / 2}
          color="#931621"
          setPopUpVisible={setHistoryVisible}
        >
          <RecImmunizationHistory
            immunizationInfos={immunizationInfos}
            type={type}
            errMsgPost={errMsgPost}
            setErrMsgPost={setErrMsgPost}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default RecImmunizationItemMultiple;
