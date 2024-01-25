import { CircularProgress } from "@mui/material";
import React from "react";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";

const FamilyDoctorsContent = ({ datas, isLoading, errMsg, patientId }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      datas && (
        <div className="topic-content">
          {datas.length > 0
            ? datas.filter(({ patients }) => patients.includes(patientId))
                .length > 0
              ? datas
                  .filter(({ patients }) => patients.includes(patientId))
                  .map((doctor) => (
                    <span key={doctor.id}>
                      Dr. {doctor.FirstName} {doctor.LastName},{" "}
                      {doctor.speciality}, {doctor.Address.Structured.City},{" "}
                      {toCodeTableName(
                        provinceStateTerritoryCT,
                        doctor.Address.Structured.CountrySubDivisionCode
                      )}
                    </span>
                  ))
              : "No family doctors"
            : "No family doctors"}
        </div>
      )
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default FamilyDoctorsContent;
