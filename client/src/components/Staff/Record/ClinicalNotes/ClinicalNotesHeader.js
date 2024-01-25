import React, { useEffect, useState } from "react";
import ClinicalNotesTitle from "./ClinicalNotesTitle";
import ClinicalNotesToolBar from "./ClinicalNotesToolBar";

const ClinicalNotesHeader = ({
  demographicsInfos,
  allContentsVisible,
  contentRef,
  triangleRef,
  addVisible,
  setAddVisible,
  search,
  setSearch,
  checkedNotes,
  setCheckedNotes,
  checkAllNotes,
  setPopUpVisible,
  selectAll,
  setSelectAll,
  progressNotes,
  allBodiesVisible,
  setAllBodiesVisible,
  order,
  setOrder,
}) => {
  const [selectAllDisabled, setSelectAllDisabled] = useState(true);
  useEffect(() => {
    if (!progressNotes) return;
    if (progressNotes.length === 0 || !allContentsVisible) {
      setSelectAllDisabled(true);
    } else {
      if (allContentsVisible) {
        setSelectAllDisabled(false);
      }
    }
  }, [progressNotes, allContentsVisible]);
  return (
    <div className="clinical-notes__header">
      <ClinicalNotesTitle
        demographicsInfos={demographicsInfos}
        allContentsVisible={allContentsVisible}
        contentRef={contentRef}
        triangleRef={triangleRef}
        setSelectAllDisabled={setSelectAllDisabled}
      />
      <ClinicalNotesToolBar
        addVisible={addVisible}
        setAddVisible={setAddVisible}
        search={search}
        setSearch={setSearch}
        contentRef={contentRef}
        triangleRef={triangleRef}
        checkedNotes={checkedNotes}
        setCheckedNotes={setCheckedNotes}
        checkAllNotes={checkAllNotes}
        setPopUpVisible={setPopUpVisible}
        selectAllDisabled={selectAllDisabled}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        allBodiesVisible={allBodiesVisible}
        setAllBodiesVisible={setAllBodiesVisible}
        order={order}
        setOrder={setOrder}
      />
    </div>
  );
};

export default ClinicalNotesHeader;
