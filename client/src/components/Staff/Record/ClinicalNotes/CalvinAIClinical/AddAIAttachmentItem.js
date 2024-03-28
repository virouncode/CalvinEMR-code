import React from "react";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";
import { extractToText } from "../../../../../utils/extractText/extractToText";

const AddAIAttachmentItem = ({
  attachment,
  attachmentsAddedIds,
  setAttachmentsAddedIds,
  attachmentsTextsToAdd,
  setAttachmentsTextsToAdd,
  isLoadingAttachmentText,
  setIsLoadingAttachmentText,
  isLoadingReportText,
  demographicsInfos,
  msgText,
  setMsgText,
}) => {
  //HANDLERS
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
          demographicsInfos.Names?.LegalName?.OtherName?.[0]?.length,
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
    setMsgText({
      ...msgText,
      attachments:
        "Here are further informations that you may use: " +
        "\n\n" +
        attachmentsTextsToAddUpdated.map(({ content }) => content).join("\n\n"),
    });
  };

  return (
    <div className="calvinai-prompt__attachment-item">
      <input
        type="checkbox"
        id={attachment.id}
        checked={isChecked(attachment.id)}
        onChange={handleChange}
        disabled={isLoadingAttachmentText || isLoadingReportText}
      />
      <label>{attachment.alias}</label>
    </div>
  );
};

export default AddAIAttachmentItem;
