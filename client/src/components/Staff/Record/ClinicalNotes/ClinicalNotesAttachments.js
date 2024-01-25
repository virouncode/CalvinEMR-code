import React from "react";
import AttachmentCard from "./AttachmentCard";

const ClinicalNotesAttachments = ({
  patientId,
  attachmentsLoading,
  attachments,
  deletable,
  handleRemoveAttachment = null,
  addable,
  date,
}) => {
  return (
    attachments && (
      <div className="clinical-notes__attachments">
        {attachments.map((attachment) => (
          <AttachmentCard
            handleRemoveAttachment={handleRemoveAttachment}
            attachment={attachment}
            key={attachment.id}
            deletable={deletable}
            patientId={patientId}
            addable={addable}
            attachmentsLoading={attachmentsLoading}
            date={date}
          />
        ))}
      </div>
    )
  );
};

export default ClinicalNotesAttachments;
