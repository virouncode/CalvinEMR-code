import { CircularProgress } from "@mui/material";
import React from "react";
import { getResidualInfo } from "../../../../../utils/getResidualInfo";

const PersonalHistoryContent = ({ datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <>
            <p>
              <label>Occupations: </label>
              {getResidualInfo("Occupations", datas[0])}
            </p>
            <p>
              <label>Income: </label>
              {getResidualInfo("Income", datas[0])}
            </p>
            <p>
              <label>Religion: </label>
              {getResidualInfo("Religion", datas[0])}
            </p>
            <p>
              <label>Sexual orientation: </label>
              {getResidualInfo("SexualOrientation", datas[0])}
            </p>
            <p>
              <label>Special diet: </label>
              {getResidualInfo("SpecialDiet", datas[0])}
            </p>
            <p>
              <label>Smoking: </label>
              {getResidualInfo("Smoking", datas[0])}
            </p>
            <p>
              <label>Alcohol: </label>
              {getResidualInfo("Alcohol", datas[0])}
            </p>
            <p>
              <label>Recreational drugs: </label>
              {getResidualInfo("RecreationalDrugs", datas[0])}
            </p>
          </>
        ) : (
          "No personal history"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default PersonalHistoryContent;
