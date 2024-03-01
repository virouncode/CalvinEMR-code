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
  handleSearch,
  checkedNotes,
  setCheckedNotes,
  checkAllNotes,
  setPopUpVisible,
  selectAll,
  setSelectAll,
  clinicalNotes,
  allBodiesVisible,
  setAllBodiesVisible,
  order,
  setOrder,
  paging,
  setPaging,
  loadingPatient,
  errPatient,
}) => {
  const [selectAllDisabled, setSelectAllDisabled] = useState(false);
  useEffect(() => {
    if (!clinicalNotes) return;
    if (clinicalNotes.length === 0 || !allContentsVisible) {
      setSelectAllDisabled(true);
    } else {
      if (allContentsVisible) {
        setSelectAllDisabled(false);
      }
    }
  }, [clinicalNotes, allContentsVisible]);
  return (
    <div className="clinical-notes__header">
      <ClinicalNotesTitle
        demographicsInfos={demographicsInfos}
        allContentsVisible={allContentsVisible}
        contentRef={contentRef}
        triangleRef={triangleRef}
        setSelectAllDisabled={setSelectAllDisabled}
        loadingPatient={loadingPatient}
        errPatient={errPatient}
      />
      <ClinicalNotesToolBar
        addVisible={addVisible}
        setAddVisible={setAddVisible}
        search={search}
        handleSearch={handleSearch}
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
        paging={paging}
        setPaging={setPaging}
      />
    </div>
  );
};

export default ClinicalNotesHeader;
