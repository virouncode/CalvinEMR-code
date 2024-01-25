import React from "react";
import MessageAttachmentCard from "./MessageAttachmentCard";

const MessagesAttachments = ({
  attachments,
  deletable,
  addable,
  cardWidth,
  handleRemoveAttachment = null,
  patientId = null,
}) => {
  return (
    attachments && (
      <div className="message-attachments">
        {attachments.map((attachment) => (
          <MessageAttachmentCard
            patientId={patientId}
            handleRemoveAttachment={handleRemoveAttachment}
            attachment={attachment}
            key={attachment.alias}
            deletable={deletable}
            cardWidth={cardWidth}
            addable={addable}
          />
        ))}
      </div>
    )
  );
};

export default MessagesAttachments;
