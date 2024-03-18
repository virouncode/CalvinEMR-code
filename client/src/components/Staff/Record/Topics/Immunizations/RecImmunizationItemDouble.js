import { DateTime } from "luxon";
import React, { useState } from "react";
import {
  timestampMonthsLaterTZ,
  timestampToDateISOTZ,
  timestampToDateMonthsLaterISOTZ,
  timestampToDateYearsLaterISOTZ,
  timestampYearsLaterTZ,
} from "../../../../../utils/formatDates";
import { getVaccinationLogo } from "../../../../../utils/getVaccinationLogo";
import LoadingParagraph from "../../../../All/UI/Tables/LoadingParagraph";
import FakeWindow from "../../../../All/UI/Windows/FakeWindow";
import RecImmunizationEditFirstDose from "./RecImmunizationEditFirstDose";
import RecImmunizationEditSecondDose from "./RecImmunizationEditSecondDose";
import RecImmunizationFormFirstDose from "./RecImmunizationFormFirstDose";
import RecImmunizationFormSecondDose from "./RecImmunizationFormSecondDose";

const RecImmunizationItemDouble = ({
  age,
  type,
  route,
  immunizationInfos,
  patientDob,
  rangeStart,
  rangeEnd,
  patientId,
  loadingPatient,
  errPatient,
}) => {
  //HOOKS

  const [formVisibleFirstDose, setFormVisibleFirstDose] = useState(false);
  const [formVisibleSecondDose, setFormVisibleSecondDose] = useState(false);
  const [editVisibleFirstDose, setEditVisibleFirstDose] = useState(false);
  const [editVisibleSecondDose, setEditVisibleSecondDose] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  //STYLES
  const INTERVAL_GRADE_7_STYLE = {
    color:
      timestampYearsLaterTZ(patientDob, 15) <
      DateTime.local({ zone: "America/Toronto" }).toMillis()
        ? "orange"
        : "black",
  };
  const INTERVAL_65_YEARS_STYLE = {
    color:
      timestampYearsLaterTZ(patientDob, 70) <
      DateTime.local({ zone: "America/Toronto" }).toMillis()
        ? "orange"
        : "black",
  };

  //HANDLERS
  const handleCheckFirstDose = async (e) => {
    const checked = e.target.checked;
    if (checked) {
      setFormVisibleFirstDose(true);
    } else {
      setEditVisibleFirstDose(true);
    }
  };

  const handleCheckSecondDose = async (e) => {
    const checked = e.target.checked;
    if (checked) {
      setFormVisibleSecondDose(true);
    } else {
      setEditVisibleSecondDose(true);
    }
  };

  const isFirstDoseChecked = () => {
    if (!immunizationInfos.length) return false;
    return immunizationInfos.find(({ doseNumber }) => doseNumber === 1)
      ? true
      : false;
  };
  const isSecondDoseChecked = () => {
    if (immunizationInfos.length < 2) return false;
    return immunizationInfos.find(({ doseNumber }) => doseNumber === 2)
      ? true
      : false;
  };

  return (
    <>
      <div className="recimmunizations-item__cell">
        <input
          type="checkbox"
          onChange={handleCheckFirstDose}
          name={type}
          checked={isFirstDoseChecked()}
        />
        {loadingPatient && <LoadingParagraph />}
        {!loadingPatient &&
        !errPatient &&
        immunizationInfos.length &&
        immunizationInfos.find(({ doseNumber }) => doseNumber === 1)?.Date ? (
          <label
            style={{
              color:
                immunizationInfos.find(({ doseNumber }) => doseNumber === 1)
                  .RefusedFlag.ynIndicatorsimple === "Y"
                  ? "red"
                  : "forestgreen",
            }}
          >
            {timestampToDateISOTZ(
              immunizationInfos.find(({ doseNumber }) => doseNumber === 1).Date
            )}{" "}
            {getVaccinationLogo(type)}
          </label>
        ) : (
          <label>
            {age === "Grade 7" &&
              type !== "Tdap_pregnancy" && ( //not a pregnancy
                <span style={INTERVAL_GRADE_7_STYLE}>
                  Grade 7 to 12 &#40;til{" "}
                  {timestampToDateYearsLaterISOTZ(patientDob, 15)}
                  &#41;
                </span>
              )}
            {age === "Grade 7" &&
              type === "Tdap_pregnancy" &&
              `One dose in every pregnancy, ideally between 27-32 weeks of gestation`}
            {age === ">=34 Years" && `Every 10 Years`}
            {age === "65 Years" && (
              <span style={INTERVAL_65_YEARS_STYLE}>
                {timestampToDateYearsLaterISOTZ(patientDob, 65)} to{" "}
                {timestampToDateYearsLaterISOTZ(patientDob, 70)}
              </span>
            )}
            {age === "6 Months" && `Every year in the fall *`}{" "}
            {getVaccinationLogo(type)}
          </label>
        )}
        {formVisibleFirstDose && (
          <FakeWindow
            title={`NEW IMMUNIZATION (${type}, first dose)`}
            width={700}
            height={600}
            x={(window.innerWidth - 700) / 2}
            y={(window.innerHeight - 600) / 2}
            color="#931621"
            setPopUpVisible={setFormVisibleFirstDose}
          >
            <RecImmunizationFormFirstDose
              setFormVisible={setFormVisibleFirstDose}
              type={type}
              age={age}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              route={route}
              patientId={patientId}
              errMsgPost={errMsgPost}
              setErrMsgPost={setErrMsgPost}
            />
          </FakeWindow>
        )}
        {editVisibleFirstDose && (
          <FakeWindow
            title={`IMMUNIZATION (${type}, first dose)`}
            width={700}
            height={600}
            x={(window.innerWidth - 700) / 2}
            y={(window.innerHeight - 600) / 2}
            color="#931621"
            setPopUpVisible={setEditVisibleFirstDose}
          >
            <RecImmunizationEditFirstDose
              immunizationInfos={immunizationInfos.find(
                ({ doseNumber }) => doseNumber === 1
              )}
              immunizationInfosSecondDose={immunizationInfos.find(
                ({ doseNumber }) => doseNumber === 2
              )}
              type={type}
              setEditVisible={setEditVisibleFirstDose}
              errMsgPost={errMsgPost}
              setErrMsgPost={setErrMsgPost}
            />
          </FakeWindow>
        )}
      </div>
      <div className="recimmunizations-item__cell">
        {type !== "Tdap_pregnancy" && type !== "Inf" && type !== "Td" && (
          <>
            <input
              type="checkbox"
              onChange={handleCheckSecondDose}
              name={type}
              checked={isSecondDoseChecked()}
              disabled={
                immunizationInfos.find(({ doseNumber }) => doseNumber === 1)
                  ? false
                  : true
              }
            />
            {immunizationInfos.length === 2 &&
            immunizationInfos.find(({ doseNumber }) => doseNumber === 2)
              ?.Date ? (
              <label
                style={{
                  color:
                    immunizationInfos.find(({ doseNumber }) => doseNumber === 2)
                      .RefusedFlag.ynIndicatorsimple === "Y"
                      ? "red"
                      : "forestgreen",
                }}
              >
                {timestampToDateISOTZ(
                  immunizationInfos.find(({ doseNumber }) => doseNumber === 2)
                    .Date
                )}{" "}
                {getVaccinationLogo(type)}
              </label>
            ) : (
              <label>
                <span style={{ color: "black" }}>
                  {age === "Grade 7" &&
                    (immunizationInfos.length &&
                    immunizationInfos.find(({ doseNumber }) => doseNumber === 1)
                      ?.Date ? (
                      <span
                        style={{
                          color:
                            timestampMonthsLaterTZ(
                              immunizationInfos.find(
                                ({ doseNumber }) => doseNumber === 1
                              ),
                              7
                            ) < DateTime.local({ zone: "America/Toronto" })
                              ? "orange"
                              : "black",
                        }}
                      >
                        {timestampToDateMonthsLaterISOTZ(
                          immunizationInfos.find(
                            ({ doseNumber }) => doseNumber === 1
                          )?.Date,
                          6
                        ) +
                          " to " +
                          timestampToDateMonthsLaterISOTZ(
                            immunizationInfos.find(
                              ({ doseNumber }) => doseNumber === 1
                            )?.Date,
                            7
                          )}
                      </span>
                    ) : (
                      `6 months after`
                    ))}
                  {age === "65 Years" &&
                    (immunizationInfos.length &&
                    immunizationInfos.find(({ doseNumber }) => doseNumber === 1)
                      ?.Date ? (
                      <span
                        style={{
                          color:
                            timestampMonthsLaterTZ(
                              immunizationInfos.find(
                                ({ doseNumber }) => doseNumber === 1
                              )?.Date,
                              7
                            ) < DateTime.local({ zone: "America/Toronto" })
                              ? "orange"
                              : "black",
                        }}
                      >
                        {timestampToDateMonthsLaterISOTZ(
                          immunizationInfos.find(
                            ({ doseNumber }) => doseNumber === 1
                          )?.Date,
                          2
                        ) +
                          " to " +
                          timestampToDateMonthsLaterISOTZ(
                            immunizationInfos.find(
                              ({ doseNumber }) => doseNumber === 1
                            )?.Date,
                            7
                          )}
                      </span>
                    ) : (
                      `2 to 6 months after`
                    ))}
                </span>{" "}
                {getVaccinationLogo(type)}
              </label>
            )}
          </>
        )}
        {formVisibleSecondDose && (
          <FakeWindow
            title={`NEW IMMUNIZATION (${type}, second dose)`}
            width={700}
            height={600}
            x={(window.innerWidth - 700) / 2}
            y={(window.innerHeight - 600) / 2}
            color="#931621"
            setPopUpVisible={setFormVisibleSecondDose}
          >
            <RecImmunizationFormSecondDose
              setFormVisible={setFormVisibleSecondDose}
              type={type}
              age={age}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              route={route}
              patientId={patientId}
              immunizationInfos={immunizationInfos}
              errMsgPost={errMsgPost}
              setErrMsgPost={setErrMsgPost}
            />
          </FakeWindow>
        )}
        {editVisibleSecondDose && (
          <FakeWindow
            title={`IMMUNIZATION (${type}, second dose)`}
            width={700}
            height={600}
            x={(window.innerWidth - 700) / 2}
            y={(window.innerHeight - 600) / 2}
            color="#931621"
            setPopUpVisible={setEditVisibleSecondDose}
          >
            <RecImmunizationEditSecondDose
              immunizationInfos={immunizationInfos.find(
                ({ doseNumber }) => doseNumber === 2
              )}
              type={type}
              setEditVisible={setEditVisibleSecondDose}
              errMsgPost={errMsgPost}
              setErrMsgPost={setErrMsgPost}
            />
          </FakeWindow>
        )}
      </div>
    </>
  );
};

export default RecImmunizationItemDouble;
