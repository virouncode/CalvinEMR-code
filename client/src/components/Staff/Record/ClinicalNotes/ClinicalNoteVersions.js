import React from "react";
import ClinicalNoteCardVersion from "./ClinicalNoteCardVersion";

const ClinicalNotesVersions = ({ versions, clinicalNote }) => {
  return (
    <div className="clinical-notes__versions">
      <ClinicalNoteCardVersion version={clinicalNote} />
      {versions
        .sort((a, b) => b.version_nbr - a.version_nbr)
        .map((version) => (
          <ClinicalNoteCardVersion version={version} key={version.id} />
        ))}
    </div>
  );
};

export default ClinicalNotesVersions;
