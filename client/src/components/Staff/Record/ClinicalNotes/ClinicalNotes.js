import React, { useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import useAuthContext from "../../../../hooks/useAuthContext";
import { useClinicalNotes } from "../../../../hooks/useClinicalNotes";
import { toLocalDateAndTimeWithSeconds } from "../../../../utils/formatDates";
import { onMessageClinicalNotes } from "../../../../utils/socketHandlers/onMessageClinicalNotes";
import {
  getLastUpdate,
  isUpdated,
} from "../../../../utils/socketHandlers/updates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import CircularProgressMedium from "../../../All/UI/Progress/CircularProgressMedium";
import ClinicalNotesPU from "../Popups/ClinicalNotesPU";
import ClinicalNotesCard from "./ClinicalNotesCard";
import ClinicalNotesForm from "./ClinicalNotesForm";
import ClinicalNotesHeader from "./ClinicalNotesHeader";

const ClinicalNotes = ({
  demographicsInfos,
  allContentsVisible,
  patientId,
}) => {
  //hooks
  const { user, socket, clinic } = useAuthContext();
  const [addVisible, setAddVisible] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [checkedNotes, setCheckedNotes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [allBodiesVisible, setAllBodiesVisible] = useState(false);
  const [order, setOrder] = useState(
    user.settings.progress_notes_order ?? "top"
  );
  const contentRef = useRef(null);
  const triangleRef = useRef(null);
  const [
    { datas: clinicalNotes, isLoading, errMsg },
    fetchRecord,
    setClinicalNotes,
  ] = useClinicalNotes("/clinical_notes_for_patient", patientId, order);

  const checkAllNotes = () => {
    const allNotesIds = clinicalNotes.map(({ id }) => id);
    setCheckedNotes(allNotesIds);
  };

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageClinicalNotes(
        message,
        clinicalNotes,
        setClinicalNotes,
        patientId,
        order
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [patientId, clinicalNotes, setClinicalNotes, socket, order]);

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
        {!isLoading ? (
          errMsg ? (
            <p className="clinical-notes__err">{errMsg}</p>
          ) : clinicalNotes && clinicalNotes.length ? (
            clinicalNotes
              .filter(
                (note) =>
                  staffIdToTitleAndName(clinic.staffInfos, note.created_by_id)
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  (isUpdated(note) &&
                    staffIdToTitleAndName(
                      clinic.staffInfos,
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
              .map((clinicalNote) => (
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
              ))
          ) : (
            !addVisible && (
              <div style={{ padding: "5px" }}>No clinical notes</div>
            )
          )
        ) : (
          <CircularProgressMedium />
        )}
      </div>
    </div>
  );
};

export default ClinicalNotes;
