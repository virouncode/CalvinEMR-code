import React from "react";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";
import { extractToText } from "../../../../../utils/extractToText";
import { getAge } from "../../../../../utils/getAge";

const AddAIAttachmentItem = ({
  attachment,
  setMessages,
  attachmentsAddedIds,
  setAttachmentsAddedIds,
  attachmentsTextsToAdd,
  setAttachmentsTextsToAdd,
  reportsTextToAdd,
  initialBody,
  demographicsInfos,
  isLoadingAttachmentText,
  setIsLoadingAttachmentText,
  isLoadingDocumentText,
}) => {
  const isChecked = (id) => attachmentsAddedIds.includes(id);
  const handleChange = async (e) => {
    const checked = e.target.checked;
    const id = parseInt(e.target.id);
    let attachmentsTextsToAddUpdated;
    if (checked) {
      setAttachmentsAddedIds([...attachmentsAddedIds, id]);
      setIsLoadingAttachmentText(true);
      let textToAdd = (
        await extractToText(attachment.file.url, attachment.file.mime)
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
      attachmentsTextsToAddUpdated = [
        ...attachmentsTextsToAdd,
        { id, content: textToAdd, date_created: attachment.date_created },
      ].sort((a, b) => a.date_created - b.date_created);
      setAttachmentsTextsToAdd(attachmentsTextsToAddUpdated);
      setIsLoadingAttachmentText(false);
    } else {
      let updatedIds = [...attachmentsAddedIds];
      updatedIds = updatedIds.filter((attachmentId) => attachmentId !== id);
      setAttachmentsAddedIds(updatedIds);
      attachmentsTextsToAddUpdated = [...attachmentsTextsToAdd].filter(
        (text) => text.id !== id
      );
      setAttachmentsTextsToAdd(attachmentsTextsToAddUpdated);
    }
    const newMessage = `Hello I'm a doctor.
    
My patient is a ${getAge(demographicsInfos.date_of_birth)} year-old ${
      demographicsInfos.gender_at_birth
    } with the following symptoms:

${initialBody}.

${
  attachmentsTextsToAddUpdated.length || reportsTextToAdd.length
    ? `Here are further informations that you may use:
           
${
  attachmentsTextsToAddUpdated.length > 0
    ? attachmentsTextsToAddUpdated.map(({ content }) => content).join("\n")
    : ""
}
${
  reportsTextToAdd.length > 0
    ? reportsTextToAdd.map(({ content }) => content).join("\n")
    : ""
}`
    : ""
}
    
What is the diagnosis and what treatment would you suggest ?`;
    setMessages([{ role: "user", content: newMessage }]);
  };

  return (
    <div className="calvinai-prompt__attachment-item">
      <input
        type="checkbox"
        id={attachment.id}
        checked={isChecked(attachment.id)}
        onChange={handleChange}
        disabled={isLoadingAttachmentText || isLoadingDocumentText}
      />
      <label>{attachment.alias}</label>
    </div>
  );
};

export default AddAIAttachmentItem;
