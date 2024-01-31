import React from "react";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";
import { extractToText } from "../../../../../utils/extractToText";
import { getAge } from "../../../../../utils/getAge";

const AddAIReportItem = ({
  report,
  setMessages,
  documentsAddedIds,
  setDocumentsAddedIds,
  reportsTextToAdd,
  setReportsTextsToAdd,
  attachmentsTextsToAdd,
  initialBody,
  demographicsInfos,
  isLoadingDocumentText,
  setIsLoadingDocumentText,
  isLoadingAttachmentText,
}) => {
  const isChecked = (id) => documentsAddedIds.includes(id);
  const handleChange = async (e) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    let reportsTextToAddUpdated;
    if (checked) {
      setDocumentsAddedIds([...documentsAddedIds, id]);
      setIsLoadingDocumentText(true);
      let textToAdd = (
        await extractToText(report.File.url, report.File.mime)
      ).join("");

      textToAdd = textToAdd
        .replaceAll(demographicsInfos.Names?.LegalName?.FirstName?.Part, "")
        .replaceAll(
          demographicsInfos.Names?.LegalName?.OtherName.length
            ? demographicsInfos.Names?.LegalName?.OtherName[0].Part
            : "",
          ""
        )
        .replaceAll(demographicsInfos.Names?.LegalName?.LastName?.Part, "")
        .replaceAll(demographicsInfos.SIN, "")
        .replaceAll(
          demographicsInfos.PhoneNumber.find(
            ({ _phoneNumberType }) => _phoneNumberType === "C"
          )?.phoneNumber,
          ""
        )
        .replaceAll(
          demographicsInfos.PhoneNumber.find(
            ({ _phoneNumberType }) => _phoneNumberType === "W"
          )?.phoneNumber,
          ""
        )
        .replaceAll(
          demographicsInfos.PhoneNumber.find(
            ({ _phoneNumberType }) => _phoneNumberType === "R"
          )?.phoneNumber,
          ""
        )
        .replaceAll(
          demographicsInfos.Address.find(
            ({ _addressType }) => _addressType === "R"
          )?.Structured?.Line1,
          ""
        )
        .replaceAll(
          demographicsInfos.Address.find(
            ({ _addressType }) => _addressType === "R"
          )?.Structured?.PostalZipCode?.PostalCode,
          ""
        )
        .replaceAll(
          demographicsInfos.Address.find(
            ({ _addressType }) => _addressType === "R"
          )?.Structured?.CountrySubDivisionCode,
          ""
        )
        .replaceAll(
          toCodeTableName(
            provinceStateTerritoryCT,
            demographicsInfos.Address.find(
              ({ _addressType }) => _addressType === "R"
            )?.Structured?.CountrySubDivisionCode
          ),
          ""
        )
        .replaceAll(
          demographicsInfos.Address.find(
            ({ _addressType }) => _addressType === "R"
          )?.Structured?.City,
          ""
        )
        .replaceAll(
          demographicsInfos.Address.find(
            ({ _addressType }) => _addressType === "M"
          )?.Structured?.Line1,
          ""
        )
        .replaceAll(
          demographicsInfos.Address.find(
            ({ _addressType }) => _addressType === "M"
          )?.Structured?.PostalZipCode?.PostalCode,
          ""
        )
        .replaceAll(
          demographicsInfos.Address.find(
            ({ _addressType }) => _addressType === "M"
          )?.Structured?.CountrySubDivisionCode,
          ""
        )
        .replaceAll(
          toCodeTableName(
            provinceStateTerritoryCT,
            demographicsInfos.Address.find(
              ({ _addressType }) => _addressType === "M"
            )?.Structured?.CountrySubDivisionCode
          ),
          ""
        )
        .replaceAll(
          demographicsInfos.Address.find(
            ({ _addressType }) => _addressType === "M"
          )?.Structured?.City,
          ""
        )
        .replaceAll(demographicsInfos.Email, "");

      reportsTextToAddUpdated = [
        ...reportsTextToAdd,
        { id, content: textToAdd, date_created: report.date_created },
      ].sort((a, b) => a.date_created - b.date_created);
      setReportsTextsToAdd(reportsTextToAddUpdated);
      setIsLoadingDocumentText(false);
    } else {
      let updatedIds = [...documentsAddedIds];
      updatedIds = updatedIds.filter((documentId) => documentId !== id);
      setDocumentsAddedIds(updatedIds);
      reportsTextToAddUpdated = [...reportsTextToAdd].filter(
        (text) => text.id !== id
      );
      setReportsTextsToAdd(reportsTextToAddUpdated);
    }
    const newMessage = `Hello I'm a doctor.
    
My patient is a ${getAge(demographicsInfos.date_of_birth)} year-old ${
      demographicsInfos.gender_at_birth
    } with the following symptoms:

${initialBody}.

${
  reportsTextToAddUpdated.length || attachmentsTextsToAdd.length
    ? `Here are further informations that you may use:

${
  attachmentsTextsToAdd.length > 0
    ? attachmentsTextsToAdd.map(({ content }) => content).join("\n")
    : ""
}         
${
  reportsTextToAddUpdated.length > 0
    ? reportsTextToAddUpdated.map(({ content }) => content).join("\n")
    : ""
}`
    : ""
}
    
What is the diagnosis and what treatment would you suggest ?`;
    setMessages([{ role: "user", content: newMessage }]);
  };

  return (
    <div className="calvinai-prompt__document-item">
      <input
        type="checkbox"
        id={report.id}
        checked={isChecked(report.id)}
        onChange={handleChange}
        disabled={isLoadingDocumentText || isLoadingAttachmentText}
      />
      <label>{report.name}</label>
    </div>
  );
};

export default AddAIReportItem;
