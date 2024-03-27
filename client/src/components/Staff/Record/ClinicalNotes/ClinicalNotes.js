import React, { useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import useClinicalNotesSocket from "../../../../hooks/socket/useClinicalNotesSocket";
import useFetchClinicalNotes from "../../../../hooks/useFetchClinicalNotes";
import useIntersection from "../../../../hooks/useIntersection";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import ClinicalNotesPU from "../Popups/ClinicalNotesPU";
import ClinicalNotesCard from "./ClinicalNotesCard";
import ClinicalNotesForm from "./ClinicalNotesForm";
import ClinicalNotesHeader from "./ClinicalNotesHeader";
import ClinicalNotesOverview from "./ClinicalNotesOverview";
import LoadingClinical from "./LoadingClinical";

const ClinicalNotes = ({
  demographicsInfos,
  notesVisible,
  setNotesVisible,
  contentsVisible,
  setContentsVisible,
  patientId,
  loadingPatient,
  errPatient,
}) => {
  const formRef = useRef(null);
  const [checkedNotes, setCheckedNotes] = useState([]);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [overviewVisible, setOverviewVisible] = useState(false);
  const triangleRef = useRef(null);
  const {
    addVisible,
    setAddVisible,
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
    setPaging,
    addVisible,
    order
  );
  //SOCKET
  useClinicalNotesSocket(clinicalNotes, setClinicalNotes, patientId, order);

  useEffect(() => {
    if (addVisible && formRef.current && !loading) {
      formRef.current.scrollIntoView({ behavior: "instant", block: "nearest" });
    }
  }, [addVisible, formRef, loading]);

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
        notesVisible={notesVisible}
        setNotesVisible={setNotesVisible}
        contentsVisible={contentsVisible}
        setContentsVisible={setContentsVisible}
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
        order={order}
        setOrder={setOrder}
        paging={paging}
        setPaging={setPaging}
        loadingPatient={loadingPatient}
        errPatient={errPatient}
        overviewVisible={overviewVisible}
        setOverviewVisible={setOverviewVisible}
        setClinicalNotes={setClinicalNotes}
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
            selectAll={selectAll}
            order={order}
            setCheckedNotes={setCheckedNotes}
          />
        </NewWindow>
      )}
      {overviewVisible && (
        <FakeWindow
          title={`CLINICAL NOTES OVERVIEW`}
          width={1400}
          height={600}
          x={(window.innerWidth - 1400) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#93b5e9"
          setPopUpVisible={setOverviewVisible}
        >
          <ClinicalNotesOverview
            clinicalNotes={clinicalNotes}
            loading={loading}
            hasMore={hasMore}
            setPaging={setPaging}
          />
        </FakeWindow>
      )}
      <div
        className={
          notesVisible
            ? "clinical-notes__content clinical-notes__content--active"
            : "clinical-notes__content"
        }
        ref={contentRef}
      >
        {clinicalNotes && addVisible && order === "desc" && (
          <ClinicalNotesForm
            formRef={formRef}
            setAddVisible={setAddVisible}
            patientId={patientId}
            demographicsInfos={demographicsInfos}
            paging={paging}
            setPaging={setPaging}
            order={order}
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
                    contentsVisible={contentsVisible}
                    demographicsInfos={demographicsInfos}
                    lastItemRef={lastItemRef}
                    addVisible={addVisible}
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
                    contentsVisible={contentsVisible}
                    demographicsInfos={demographicsInfos}
                  />
                )
              )
            : !addVisible &&
              !loading && (
                <div style={{ padding: "5px" }}>No clinical notes</div>
              ))}
        {loading && <LoadingClinical />}
        {!loading && clinicalNotes && addVisible && order === "asc" && (
          <ClinicalNotesForm
            formRef={formRef}
            setAddVisible={setAddVisible}
            patientId={patientId}
            demographicsInfos={demographicsInfos}
            paging={paging}
            setPaging={setPaging}
            order={order}
          />
        )}
      </div>
    </div>
  );
};

export default ClinicalNotes;
