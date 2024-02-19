import React from "react";
import CircularProgressSmall from "../../../All/UI/Progress/CircularProgressSmall";
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
    <div className="clinical-notes__attachments">
      {attachments && attachments.length > 0
        ? attachments.map((attachment) => (
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
          ))
        : null}
      {attachmentsLoading && (
        <div>
          Loading attachments...
          <CircularProgressSmall />
        </div>
      )}
    </div>
  );
};

export default ClinicalNotesAttachments;
