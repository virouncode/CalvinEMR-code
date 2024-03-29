import React from "react";
import MessageAttachmentCard from "./MessageAttachmentCard";

const MessagesAttachments = ({
  attachments,
  deletable,
  addable,
  cardWidth,
  handleRemoveAttachment = null,
  patientId = null,
  patientName,
  message,
}) => {
  return (
    attachments && (
      <div className="message-attachments">
        {attachments.map((attachment) => (
          <MessageAttachmentCard
            handleRemoveAttachment={handleRemoveAttachment}
            attachment={attachment}
            key={attachment.alias}
            deletable={deletable}
            cardWidth={cardWidth}
            addable={addable}
            patientName={patientName}
            message={message}
          />
        ))}
      </div>
    )
  );
};

export default MessagesAttachments;
