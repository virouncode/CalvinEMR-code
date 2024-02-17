import React, { useEffect, useState } from "react";
import {
  toCodeTableName,
  ynIndicatorsimpleCT,
} from "../../../../../datas/codesTables";
import { cmToFeet, kgToLbs } from "../../../../../utils/measurements";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const CareElementsContent = ({ datas, isLoading, errMsg }) => {
  //HOOKS
  const [lastDatas, setLastDatas] = useState(null);
  useEffect(() => {
    if (datas && datas.length !== 0) {
      setLastDatas({
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
      });
    }
  }, [datas]);

  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 && lastDatas ? (
          <>
            <p>
              <label>Smoking: </label>
              {toCodeTableName(
                ynIndicatorsimpleCT,
                lastDatas.SmokingStatus?.Status
              )}
            </p>
            <p>
              <label>Smoking Packs (per day): </label>
              {lastDatas.SmokingPacks?.PerDay}
            </p>
            <p>
              <label>Weight (kg): </label>
              {lastDatas.Weight?.Weight}
            </p>
            <p>
              <label>Weight (lbs): </label>
              {kgToLbs(lastDatas.Weight?.Weight)}
            </p>
            <p>
              <label>Height (cm): </label>
              {lastDatas.Height?.Height}
            </p>
            <p>
              <label>Height (feet): </label>
              {cmToFeet(lastDatas.Height?.Height)}
            </p>
            <p>
              <label>Body Mass Index (kg/m2): </label>
              {lastDatas.bodyMassIndex?.BMI}
            </p>
            <p>
              <label>Body Surface Area (m2): </label>
              {lastDatas.bodySurfaceArea?.BSA}
            </p>
            <p>
              <label>Waist Circumference (cm): </label>
              {lastDatas.WaistCircumference?.WaistCircumference}
            </p>
            <p>
              <label>Systolic(mmHg): </label>
              {lastDatas.BloodPressure?.SystolicBP}
            </p>
            <p>
              <label>Diastolic(mmHg): </label>
              {lastDatas.BloodPressure?.DiastolicBP}
            </p>
          </>
        ) : (
          "No care elements"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default CareElementsContent;
