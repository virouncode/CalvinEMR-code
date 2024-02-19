import React, { useRef, useState } from "react";
import NewWindow from "react-new-window";
import useClinicalNotesSocket from "../../../../hooks/useClinicalNotesSocket";
import useFetchClinicalNotes from "../../../../hooks/useFetchClinicalNotes";
import useIntersection from "../../../../hooks/useIntersection";
import useSocketContext from "../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import { toLocalDateAndTimeWithSeconds } from "../../../../utils/formatDates";
import {
  getLastUpdate,
  isUpdated,
} from "../../../../utils/socketHandlers/updates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
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
  //hooks
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [addVisible, setAddVisible] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [checkedNotes, setCheckedNotes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [allBodiesVisible, setAllBodiesVisible] = useState(true);
  const triangleRef = useRef(null);
  //DATAS
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 5,
    offset: 0,
  });
  const {
    clinicalNotes,
    setClinicalNotes,
    order,
    setOrder,
    loading,
    errMsg,
    hasMore,
  } = useFetchClinicalNotes(paging, patientId);
  //INTERSECTION OBSERVER
  const { rootRef: contentRef, lastItemRef } = useIntersection(
    loading,
    hasMore,
    setPaging
  );

  const checkAllNotes = () => {
    const allNotesIds = clinicalNotes.map(({ id }) => id);
    setCheckedNotes(allNotesIds);
  };

  useClinicalNotesSocket(clinicalNotes, setClinicalNotes, patientId, order);

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
        setSearch={setSearch}
        checkedNotes={checkedNotes}
        setCheckedNotes={setCheckedNotes}
        checkAllNotes={checkAllNotes}
        setPopUpVisible={setPopUpVisible}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        clinicalNotes={clinicalNotes}
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
        {clinicalNotes && clinicalNotes.length > 0
          ? clinicalNotes
              .filter(
                (note) =>
                  staffIdToTitleAndName(staffInfos, note.created_by_id)
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  (isUpdated(note) &&
                    staffIdToTitleAndName(
                      staffInfos,
                      getLastUpdate(note).updated_by_id
                    )
                      .toLowerCase()
                      .includes(search.toLowerCase())) ||
                  note.subject.toLowerCase().includes(search.toLowerCase()) ||
                  note.MyClinicalNotesContent.toLowerCase().includes(
                    search.toLowerCase()
                  ) ||
                  toLocalDateAndTimeWithSeconds(note.date_created).includes(
                    search.toLowerCase()
                  ) ||
                  (isUpdated(note) &&
                    toLocalDateAndTimeWithSeconds(
                      getLastUpdate(note).date_updated
                    ).includes(search.toLowerCase()))
              )
              .map((clinicalNote, index) =>
                index === clinicalNotes.length - 1 ? (
                  <ClinicalNotesCard
                    clinicalNote={clinicalNote}
                    clinicalNotes={clinicalNotes}
                    setClinicalNotes={setClinicalNotes}
                    order={order}
                    patientId={patientId}
                    key={clinicalNote.id}
                    checkedNotes={checkedNotes}
                    setCheckedNotes={setCheckedNotes}
                    setSelectAll={setSelectAll}
                    allBodiesVisible={allBodiesVisible}
                    demographicsInfos={demographicsInfos}
                    lastItemRef={lastItemRef}
                  />
                ) : (
                  <ClinicalNotesCard
                    clinicalNote={clinicalNote}
                    clinicalNotes={clinicalNotes}
                    setClinicalNotes={setClinicalNotes}
                    order={order}
                    patientId={patientId}
                    key={clinicalNote.id}
                    checkedNotes={checkedNotes}
                    setCheckedNotes={setCheckedNotes}
                    setSelectAll={setSelectAll}
                    allBodiesVisible={allBodiesVisible}
                    demographicsInfos={demographicsInfos}
                  />
                )
              )
          : !addVisible &&
            !loading && <div style={{ padding: "5px" }}>No clinical notes</div>}
        {loading && <LoadingClinical />}
      </div>
    </div>
  );
};

export default ClinicalNotes;
