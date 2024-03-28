import React from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import ClinicalNoteOverviewCard from "./ClinicalNoteOverviewCard";

const ClinicalNotesOverview = ({
  clinicalNotes,
  loading,
  hasMore,
  setPaging,
}) => {
  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);
  return (
    <div className="clinical-notes__overview" ref={rootRef}>
      {clinicalNotes.length > 0 ? (
        clinicalNotes.map((clinicalNote, index) =>
          index === clinicalNotes.length - 1 ? (
            <ClinicalNoteOverviewCard
              key={clinicalNote.id}
              clinicalNote={clinicalNote}
              lastItemRef={lastItemRef}
            />
          ) : (
            <ClinicalNoteOverviewCard
              key={clinicalNote.id}
              clinicalNote={clinicalNote}
            />
          )
        )
      ) : (
        <p>No clinical notes</p>
      )}
    </div>
  );
};

export default ClinicalNotesOverview;

///FRAIRE DU INFINITE SCROLL AUSSI
