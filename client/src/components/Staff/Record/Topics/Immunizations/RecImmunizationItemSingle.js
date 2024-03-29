import { DateTime } from "luxon";
import React, { useState } from "react";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import { getImmunizationLogo } from "../../../../../utils/immunizations/getImmunizationLogo";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import RecImmunizationEdit from "./RecImmunizationEdit";
import RecImmunizationForm from "./RecImmunizationForm";

const RecImmunizationItemSingle = ({
  age,
  type,
  route,
  immunizationInfos,
  rangeStart,
  rangeEnd,
  patientId,
  loadingPatient,
  errPatient,
}) => {
  //HOOKS
  const [formVisible, setFormVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  //STYLES
  const INTERVAL_STYLE = {
    color:
      rangeEnd < DateTime.local({ zone: "America/Toronto" })
        ? "orange"
        : "black",
  };

  //HANDLERS
  const handleCheck = async (e) => {
    const checked = e.target.checked;
    if (checked) {
      setFormVisible(true);
    } else {
      setEditVisible(true);
    }
  };

  const isChecked = () => {
    return immunizationInfos.Date ? true : false;
  };

  return (
    <div className="recimmunizations-item__cell">
      <input
        type="checkbox"
        onChange={handleCheck}
        name={type}
        checked={isChecked()}
      />
      {loadingPatient && <LoadingParagraph />}
      {!loadingPatient && !errPatient && immunizationInfos.Date ? (
        <label
          style={{
            color:
              immunizationInfos.RefusedFlag.ynIndicatorsimple === "Y"
                ? "red"
                : "forestgreen",
          }}
        >
          {timestampToDateISOTZ(immunizationInfos.Date)}{" "}
          {getImmunizationLogo(route)}
        </label>
      ) : (
        <label>
          <span style={INTERVAL_STYLE}>
            {age === "Grade 7"
              ? `Grade 7 to 12 (til ${timestampToDateISOTZ(rangeEnd)})`
              : `${timestampToDateISOTZ(rangeStart)} to ${timestampToDateISOTZ(
                  rangeEnd
                )}`}
          </span>{" "}
          {getImmunizationLogo(route)}
        </label>
      )}
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
          <RecImmunizationForm
            setFormVisible={setFormVisible}
            immunizationInfos={immunizationInfos}
            type={type}
            age={age}
            rangeStart={rangeStart}
            route={route}
            patientId={patientId}
            errMsgPost={errMsgPost}
            setErrMsgPost={setErrMsgPost}
          />
        </FakeWindow>
      )}
      {editVisible && (
        <FakeWindow
          title={`IMMUNIZATION (${type})`}
          width={700}
          height={600}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#931621"
          setPopUpVisible={setEditVisible}
        >
          <RecImmunizationEdit
            immunizationInfos={immunizationInfos}
            type={type}
            age={age}
            rangeStart={rangeStart}
            route={route}
            patientId={patientId}
            setEditVisible={setEditVisible}
            errMsgPost={errMsgPost}
            setErrMsgPost={setErrMsgPost}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default RecImmunizationItemSingle;
