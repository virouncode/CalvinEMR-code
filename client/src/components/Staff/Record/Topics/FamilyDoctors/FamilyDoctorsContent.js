import React from "react";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const FamilyDoctorsContent = ({
  patientDoctors,
  loadingPatientDoctors,
  errMsgPatientDoctors,
}) => {
  return !loadingPatientDoctors ? (
    errMsgPatientDoctors ? (
      <p className="topic-content__err">{errMsgPatientDoctors}</p>
    ) : (
      <div className="topic-content">
        {patientDoctors && patientDoctors.length > 0 ? (
          <ul>
            {patientDoctors.slice(0, 4).map((item) => (
              <li key={item.id}>
                - Dr. {item.FirstName} {item.LastName}, {item.speciality},{" "}
                {item.Address.Structured.City},{" "}
                {toCodeTableName(
                  provinceStateTerritoryCT,
                  item.Address.Structured.CountrySubDivisionCode
                )}
              </li>
            ))}
            <li>...</li>
          </ul>
        ) : (
          "No family doctors"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default FamilyDoctorsContent;
