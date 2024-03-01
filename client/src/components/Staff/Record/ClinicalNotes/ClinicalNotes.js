import React, { useRef, useState } from "react";
import NewWindow from "react-new-window";
import useClinicalNotesSocket from "../../../../hooks/useClinicalNotesSocket";
import useFetchClinicalNotes from "../../../../hooks/useFetchClinicalNotes";
import useIntersection from "../../../../hooks/useIntersection";
import ClinicalNotesPU from "../Popups/ClinicalNotesPU";
import ClinicalNotesCard from "./ClinicalNotesCard";
import ClinicalNotesForm from "./ClinicalNotesForm";
import ClinicalNotesHeader from "./ClinicalNotesHeader";
import LoadingClinical from "./LoadingClinical";

const ClinicalNotes = ({
  demographicsInfos,
  allContentsVisible,
  patientId,
  loadingPatient,
  errPatient,
}) => {
  const [addVisible, setAddVisible] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [checkedNotes, setCheckedNotes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [allBodiesVisible, setAllBodiesVisible] = useState(true);
  const triangleRef = useRef(null);
  const {
    order,
    setOrder,
    search,
    setSearch,
    clinicalNotes,
    setClinicalNotes,
    loading,
    errMsg,
    hasMore,
    setPaging,
    paging,
  } = useFetchClinicalNotes(patientId);

  //INTERSECTION OBSERVER
  const { rootRef: contentRef, lastItemRef } = useIntersection(
    loading,
    hasMore,
    setPaging
  );
  //SOCKET
  useClinicalNotesSocket(clinicalNotes, setClinicalNotes, patientId, order);

  //HANDLERS
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPaging({ ...paging, page: 1 });
  };

  const checkAllNotes = () => {
    const allNotesIds = clinicalNotes.map(({ id }) => id);
    setCheckedNotes(allNotesIds);
  };

  return (
    <div className="clinical-notes">
      <ClinicalNotesHeader
        demographicsInfos={demographicsInfos}
        allContentsVisible={allContentsVisible}
        contentRef={contentRef}
        triangleRef={triangleRef}
        addVisible={addVisible}
        setAddVisible={setAddVisible}
        search={search}
        handleSearch={handleSearch}
        checkedNotes={checkedNotes}
        setCheckedNotes={setCheckedNotes}
        checkAllNotes={checkAllNotes}
        setPopUpVisible={setPopUpVisible}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        allBodiesVisible={allBodiesVisible}
        setAllBodiesVisible={setAllBodiesVisible}
        order={order}
        setOrder={setOrder}
        paging={paging}
        setPaging={setPaging}
        loadingPatient={loadingPatient}
        errPatient={errPatient}
      />
      {popUpVisible && (
        <NewWindow
          title="Patient clinical notes"
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 793.7,
            height: 1122.5,
            left: 320,
            top: 200,
          }}
          onUnload={() => setPopUpVisible(false)}
        >
          <ClinicalNotesPU
            demographicsInfos={demographicsInfos}
            clinicalNotes={clinicalNotes}
            checkedNotes={checkedNotes}
          />
        </NewWindow>
      )}

      <div
        className={
          allContentsVisible
            ? "clinical-notes__content clinical-notes__content--active"
            : "clinical-notes__content"
        }
        ref={contentRef}
      >
        {clinicalNotes && addVisible && (
          <ClinicalNotesForm
            setAddVisible={setAddVisible}
            patientId={patientId}
            demographicsInfos={demographicsInfos}
          />
        )}
        {errMsg && <p className="clinical-notes__err">{errMsg}</p>}
        {!errMsg &&
          (clinicalNotes && clinicalNotes.length > 0
            ? clinicalNotes.map((item, index) =>
                index === clinicalNotes.length - 1 ? (
                  <ClinicalNotesCard
                    clinicalNote={item}
                    clinicalNotes={clinicalNotes}
                    setClinicalNotes={setClinicalNotes}
                    order={order}
                    patientId={patientId}
                    key={item.id}
                    checkedNotes={checkedNotes}
                    setCheckedNotes={setCheckedNotes}
                    setSelectAll={setSelectAll}
                    allBodiesVisible={allBodiesVisible}
                    demographicsInfos={demographicsInfos}
                    lastItemRef={lastItemRef}
                  />
                ) : (
                  <ClinicalNotesCard
                    clinicalNote={item}
                    clinicalNotes={clinicalNotes}
                    setClinicalNotes={setClinicalNotes}
                    order={order}
                    patientId={patientId}
                    key={item.id}
                    checkedNotes={checkedNotes}
                    setCheckedNotes={setCheckedNotes}
                    setSelectAll={setSelectAll}
                    allBodiesVisible={allBodiesVisible}
                    demographicsInfos={demographicsInfos}
                  />
                )
              )
            : !addVisible &&
              !loading && (
                <div style={{ padding: "5px" }}>No clinical notes</div>
              ))}
        {loading && <LoadingClinical />}
      </div>
    </div>
  );
};

export default ClinicalNotes;
