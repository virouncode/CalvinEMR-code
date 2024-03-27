import React from "react";
import { getResidualInfo } from "../../../../../utils/migration/exports/getResidualInfo";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const PersonalHistoryContent = ({ topicDatas, loading, errMsg }) => {
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas && topicDatas.length >= 1 ? (
          <>
            <p>
              <label>Occupations: </label>
              {getResidualInfo("Occupations", topicDatas[0])}
            </p>
            <p>
              <label>Income: </label>
              {getResidualInfo("Income", topicDatas[0])}
            </p>
            <p>
              <label>Religion: </label>
              {getResidualInfo("Religion", topicDatas[0])}
            </p>
            <p>
              <label>Sexual orientation: </label>
              {getResidualInfo("SexualOrientation", topicDatas[0])}
            </p>
            <p>
              <label>Special diet: </label>
              {getResidualInfo("SpecialDiet", topicDatas[0])}
            </p>
            <p>
              <label>Smoking: </label>
              {getResidualInfo("Smoking", topicDatas[0])}
            </p>
            <p>
              <label>Alcohol: </label>
              {getResidualInfo("Alcohol", topicDatas[0])}
            </p>
            <p>
              <label>Recreational drugs: </label>
              {getResidualInfo("RecreationalDrugs", topicDatas[0])}
            </p>
          </>
        ) : (
          "No personal history"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default PersonalHistoryContent;
