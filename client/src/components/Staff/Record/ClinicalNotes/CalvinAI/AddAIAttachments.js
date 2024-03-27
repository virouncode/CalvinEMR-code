import React, { useState } from "react";
import CircularProgressSmall from "../../../../UI/Progress/CircularProgressSmall";
import AddAIAttachmentItem from "./AddAIAttachmentItem";

const AddAIAttachments = ({
  attachments,
  demographicsInfos,
  isLoadingAttachmentText,
  setIsLoadingAttachmentText,
  isLoadingDocumentText,
  attachmentsTextsToAdd,
  setAttachmentsTextsToAdd,
  msgText,
  setMsgText,
}) => {
  const [attachmentsAddedIds, setAttachmentsAddedIds] = useState([]);

  return (
    <div className="calvinai-prompt__attachments">
      <p>
        Add attachments datas
        {isLoadingAttachmentText && <CircularProgressSmall />}
      </p>
      {attachments.map((attachment) => (
        <AddAIAttachmentItem
          key={attachment.id}
          attachment={attachment}
          attachmentsAddedIds={attachmentsAddedIds}
          setAttachmentsAddedIds={setAttachmentsAddedIds}
          attachmentsTextsToAdd={attachmentsTextsToAdd}
          setAttachmentsTextsToAdd={setAttachmentsTextsToAdd}
          isLoadingAttachmentText={isLoadingAttachmentText}
          setIsLoadingAttachmentText={setIsLoadingAttachmentText}
          isLoadingDocumentText={isLoadingDocumentText}
          demographicsInfos={demographicsInfos}
          msgText={msgText}
          setMsgText={setMsgText}
        />
      ))}
    </div>
  );
};

export default AddAIAttachments;
