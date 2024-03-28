import React from "react";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";
import { extractToText } from "../../../../../utils/extractText/extractToText";

const AddAIReportItem = ({
  report,
  reportsAddedIds,
  setReportsAddedIds,
  reportsTextToAdd,
  setReportsTextsToAdd,
  demographicsInfos,
  isLoadingReportText,
  setIsLoadingReportText,
  isLoadingAttachmentText,
  msgText,
  setMsgText,
  lastItemRef = null,
}) => {
  const isChecked = (id) => reportsAddedIds.includes(id);
  const handleChange = async (e) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    let reportsTextsToAddUpdated;
    if (checked) {
      setReportsAddedIds([...reportsAddedIds, id]);
      let textToAdd;
      if (report.File) {
        setIsLoadingReportText(true);
        textToAdd = (
          await extractToText(report.File?.url, report.File?.mime)
        ).join("");
      } else {
        textToAdd = report.Content.TextContent;
      }

      textToAdd = textToAdd
        .replaceAll(demographicsInfos.Names?.LegalName?.FirstName?.Part, "")
        .replaceAll(
          demographicsInfos.Names?.LegalName?.OtherName?.[0]?.Part,
          ""
        )
        .replaceAll(demographicsInfos.Names?.LegalName?.LastName?.Part, "")
        .replaceAll(demographicsInfos.SIN, "")
        .replaceAll(demographicsInfos.HealthCard?.Number, "")
        .replaceAll(
          demographicsInfos.PhoneNumber?.find(
            ({ _phoneNumberType }) => _phoneNumberType === "C"
          )?.phoneNumber,
          ""
        )
        .replaceAll(
          demographicsInfos.PhoneNumber?.find(
            ({ _phoneNumberType }) => _phoneNumberType === "W"
          )?.phoneNumber,
          ""
        )
        .replaceAll(
          demographicsInfos.PhoneNumber?.find(
            ({ _phoneNumberType }) => _phoneNumberType === "R"
          )?.phoneNumber,
          ""
        )
        .replaceAll(
          demographicsInfos.Address?.find(
            ({ _addressType }) => _addressType === "R"
          )?.Structured?.Line1,
          ""
        )
        .replaceAll(
          demographicsInfos.Address?.find(
            ({ _addressType }) => _addressType === "R"
          )?.Structured?.PostalZipCode?.PostalCode,
          ""
        )
        .replaceAll(
          demographicsInfos.Address?.find(
            ({ _addressType }) => _addressType === "R"
          )?.Structured?.PostalZipCode?.ZipCode,
          ""
        )
        .replaceAll(
          demographicsInfos.Address?.find(
            ({ _addressType }) => _addressType === "R"
          )?.Structured?.CountrySubDivisionCode,
          ""
        )
        .replaceAll(
          toCodeTableName(
            provinceStateTerritoryCT,
            demographicsInfos.Address?.find(
              ({ _addressType }) => _addressType === "R"
            )?.Structured?.CountrySubDivisionCode
          ),
          ""
        )
        .replaceAll(
          demographicsInfos.Address?.find(
            ({ _addressType }) => _addressType === "R"
          )?.Structured?.City,
          ""
        )
        .replaceAll(demographicsInfos.Email, "");

      reportsTextsToAddUpdated = [
        ...reportsTextToAdd,
        { id, content: textToAdd, date_created: report.date_created },
      ].sort((a, b) => a.date_created - b.date_created);
      setReportsTextsToAdd(reportsTextsToAddUpdated);
      setIsLoadingReportText(false);
    } else {
      let updatedIds = [...reportsAddedIds];
      updatedIds = updatedIds.filter((documentId) => documentId !== id);
      setReportsAddedIds(updatedIds);
      reportsTextsToAddUpdated = [...reportsTextToAdd].filter(
        (text) => text.id !== id
      );
      setReportsTextsToAdd(reportsTextsToAddUpdated);
    }
    setMsgText({
      ...msgText,
      reports: reportsTextsToAddUpdated
        .map(({ content }) => content)
        .join("\n\n"),
    });
  };

  return (
    <li className="calvinai-prompt__document-item" ref={lastItemRef}>
      <input
        type="checkbox"
        id={report.id}
        checked={isChecked(report.id)}
        onChange={handleChange}
        disabled={isLoadingReportText || isLoadingAttachmentText}
      />
      <label>{report.name}</label>
    </li>
  );
};

export default AddAIReportItem;
