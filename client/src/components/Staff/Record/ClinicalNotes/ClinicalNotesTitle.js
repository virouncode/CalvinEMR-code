import React from "react";
import { genderCT, toCodeTableName } from "../../../../datas/codesTables";
import { getAge } from "../../../../utils/getAge";
import { toPatientName } from "../../../../utils/toPatientName";
import CircularProgressSmall from "../../../All/UI/Progress/CircularProgressSmall";
import TriangleButton from "../Buttons/TriangleButton";

const ClinicalNotesTitle = ({
  demographicsInfos,
  allContentsVisible,
  contentRef,
  triangleRef,
  setSelectAllDisabled,
  loadingPatient,
  errPatient,
}) => {
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
      {errPatient && <div>{errPatient}</div>}
      {loadingPatient && (
        <div>
          Loading...
          <CircularProgressSmall />
        </div>
      )}
      {!loadingPatient && !errPatient && demographicsInfos && (
        <span>
          {toPatientName(demographicsInfos)},{" "}
          {toCodeTableName(genderCT, demographicsInfos.Gender)},{" "}
          {getAge(demographicsInfos.DateOfBirth)}, Chart Nbr:{" "}
          {demographicsInfos.ChartNumber},{" "}
          <i className="fa-regular fa-envelope fa-sm"></i>{" "}
          {demographicsInfos.Email}, <i className="fa-solid fa-phone fa-sm"></i>{" "}
          {
            demographicsInfos.PhoneNumber?.find(
              ({ _phoneNumberType }) => _phoneNumberType === "C"
            )?.phoneNumber
          }
        </span>
      )}
    </div>
  );
};

export default ClinicalNotesTitle;
