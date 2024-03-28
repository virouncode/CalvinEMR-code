import React from "react";

const ClinicalNoteCardBody = ({ tempFormDatas, editVisible, handleChange }) => {
  return (
    <div className="clinical-notes__card-body">
      {!editVisible ? (
        <p>{tempFormDatas.MyClinicalNotesContent}</p>
      ) : (
        <textarea
          name="MyClinicalNotesContent"
          cols="90"
          rows="20"
          onChange={handleChange}
          value={tempFormDatas.MyClinicalNotesContent}
        />
      )}
    </div>
  );
};

export default ClinicalNoteCardBody;
