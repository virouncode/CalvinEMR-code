import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const FamilyDoctorsContent = ({
  patientDoctors,
  loadingPatientDoctors,
  errMsgPatientDoctors,
  patientId,
}) => {
  const { staffInfos } = useStaffInfosContext();
  const patientClinicDoctors = staffInfos.filter(
    (staff) =>
      staff.title === "Doctor" && staff.patients.includes(parseInt(patientId))
  );
  return !loadingPatientDoctors ? (
    errMsgPatientDoctors ? (
      <p className="topic-content__err">{errMsgPatientDoctors}</p>
    ) : (
      <div className="topic-content">
        <p style={{ fontWeight: "bold" }}>External</p>
        {patientDoctors && patientDoctors.length > 0 ? (
          <ul>
            {patientDoctors.slice(0, 4).map((item) => (
              <li key={item.id}>
                - Dr. {item.FirstName} {item.LastName}, {item.speciality},{" "}
                {item.Address?.Structured?.City},{" "}
                {toCodeTableName(
                  provinceStateTerritoryCT,
                  item.Address?.Structured?.CountrySubDivisionCode
                )}
              </li>
            ))}
            <li>...</li>
          </ul>
        ) : (
          "No external family doctors/specialists"
        )}
        <p style={{ fontWeight: "bold" }}>Clinic</p>
        {patientClinicDoctors &&
          (patientClinicDoctors.length > 0 ? (
            <ul>
              {patientClinicDoctors.slice(0, 4).map((item) => (
                <li key={item.id}>
                  - Dr. {item.first_name} {item.last_name}, {item.speciality}
                </li>
              ))}
              <li>...</li>
            </ul>
          ) : (
            "No clinic family doctors/specialist"
          ))}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default FamilyDoctorsContent;
