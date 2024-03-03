import React from "react";
import { genderCT, toCodeTableName } from "../../../../datas/codesTables";
import { toLocalDate } from "../../../../utils/formatDates";
import { getAge } from "../../../../utils/getAge";
import { toPatientName } from "../../../../utils/toPatientName";
import LoadingParagraph from "../../../All/UI/Tables/LoadingParagraph";
import TriangleButton from "../Buttons/TriangleButton";

const ClinicalNotesTitle = ({
  demographicsInfos,
  notesVisible,
  setNotesVisible,
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
    setNotesVisible((v) => !v);
  };

  return (
    <div className="clinical-notes__title">
      <div>
        <TriangleButton
          handleTriangleClick={handleTriangleClick}
          className={notesVisible ? "triangle triangle--active" : "triangle"}
          color="#21201e"
          triangleRef={triangleRef}
        />
      </div>
      {errPatient && <div>{errPatient}</div>}
      {loadingPatient && <LoadingParagraph />}
      {!loadingPatient && !errPatient && demographicsInfos && (
        <span>
          {toPatientName(demographicsInfos)},{" "}
          {toCodeTableName(genderCT, demographicsInfos.Gender)},{" "}
          {getAge(demographicsInfos.DateOfBirth)}, born{" "}
          {toLocalDate(demographicsInfos.DateOfBirth)}, Chart Nbr:{" "}
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
