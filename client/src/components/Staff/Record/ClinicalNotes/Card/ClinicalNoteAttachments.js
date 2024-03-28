import React from "react";
import ClinicalNoteAttachmentCard from "./ClinicalNoteAttachmentCard";

const ClinicalNoteAttachments = ({
  patientId,
  attachments,
  deletable,
  handleRemoveAttachment = null,
  addable,
  date,
}) => {
  return (
    <div className="clinical-notes__attachments">
      {attachments && attachments.length > 0
        ? attachments.map((attachment) => (
            <ClinicalNoteAttachmentCard
              handleRemoveAttachment={handleRemoveAttachment}
              attachment={attachment}
              key={attachment.id}
              deletable={deletable}
              patientId={patientId}
              addable={addable}
              date={date}
            />
          ))
        : null}
    </div>
  );
};

export default ClinicalNoteAttachments;
