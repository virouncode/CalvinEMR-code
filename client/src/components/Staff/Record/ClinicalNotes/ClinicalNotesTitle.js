import React from "react";
import { genderCT, toCodeTableName } from "../../../../datas/codesTables";
import useAuth from "../../../../hooks/useAuth";
import { getAge } from "../../../../utils/getAge";
import { patientIdToName } from "../../../../utils/patientIdToName";
import TriangleButton from "../Buttons/TriangleButton";

const ClinicalNotesTitle = ({
  demographicsInfos,
  allContentsVisible,
  contentRef,
  triangleRef,
  setSelectAllDisabled,
}) => {
  const { clinic } = useAuth();
  const handleTriangleClick = (e) => {
    e.target.classList.toggle("triangle--active");
    contentRef.current.classList.toggle("clinical-notes__content--active");
    setSelectAllDisabled((d) => !d);
  };

  return (
    <div className="clinical-notes__title">
      <div>
        <TriangleButton
          handleTriangleClick={handleTriangleClick}
          className={
            allContentsVisible ? "triangle triangle--active" : "triangle"
          }
          color="#21201e"
          triangleRef={triangleRef}
        />
        <strong style={{ marginLeft: "10px" }}>CLINICAL NOTES </strong>
      </div>
      <span>
        {patientIdToName(
          clinic.demographicsInfos,
          demographicsInfos.patient_id,
          true
        )}
        , {toCodeTableName(genderCT, demographicsInfos.Gender)},{" "}
        {getAge(demographicsInfos.DateOfBirth)}, Chart Nbr:{" "}
        {demographicsInfos.ChartNumber},{" "}
        <i className="fa-regular fa-envelope fa-sm"></i>{" "}
        {demographicsInfos.Email}, <i className="fa-solid fa-phone fa-sm"></i>{" "}
        {
          demographicsInfos.PhoneNumber.find(
            ({ _phoneNumberType }) => _phoneNumberType === "C"
          )?.phoneNumber
        }
      </span>
    </div>
  );
};

export default ClinicalNotesTitle;
