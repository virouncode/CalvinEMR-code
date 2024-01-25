import React from "react";
import { genderCT } from "../../../../datas/codesTables";
import { getAge } from "../../../../utils/getAge";
import ClinicalNotesCardPrint from "../ClinicalNotes/ClinicalNotesCardPrint";

const ClinicalNotesPU = ({
  demographicsInfos,
  clinicalNotes,
  checkedNotes,
}) => {
  const handlePrint = (e) => {
    e.nativeEvent.view.print();
  };
  return (
    <div className="clinical-notes__print-page">
      <p
        style={{
          fontSize: "0.85rem",
          fontFamily: "Arial",
          marginLeft: "5px",
        }}
      >
        <em>
          {demographicsInfos.Names.NamePrefix
            ? `${demographicsInfos.Names.NamePrefix}. `
            : ""}
          {demographicsInfos.Names.LegalName.FirstName.Part}{" "}
          {demographicsInfos.Names.LegalName.OtherName.Part
            ? `${demographicsInfos.Names.LegalName.OtherName.Part} `
            : ""}
          {demographicsInfos.Names.LegalName.LastName.Part}{" "}
          {demographicsInfos.Names.LastNameSuffix
            ? `${demographicsInfos.Names.LastNameSuffix}. `
            : ""}
          ,{" "}
          {genderCT.find(({ code }) => code === demographicsInfos.Gender)?.name}
          , {getAge(demographicsInfos.DateOfBirth)}, Chart Nbr:{" "}
          {demographicsInfos.ChartNumber},{" "}
          <i className="fa-regular fa-envelope fa-sm"></i>{" "}
          {demographicsInfos.Email}, <i className="fa-solid fa-phone fa-sm"></i>{" "}
          {
            demographicsInfos.PhoneNumber.find(
              ({ _phoneNumberType }) => _phoneNumberType === "C"
            )?.phoneNumber
          }
        </em>
      </p>
      {clinicalNotes
        .filter(({ id }) => checkedNotes.includes(id))
        .map((clinicalNote) => (
          <ClinicalNotesCardPrint
            clinicalNote={clinicalNote}
            key={clinicalNote.id}
          />
        ))}
      <p style={{ textAlign: "center" }}>
        <button
          type="button"
          onClick={handlePrint}
          style={{ width: "100px" }}
          className="clinical-notes__print-page-btn"
        >
          Print
        </button>
      </p>
    </div>
  );
};

export default ClinicalNotesPU;
