import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import { genderCT, toCodeTableName } from "../../../../omdDatas/codesTables";
import {
  getAgeTZ,
  timestampToDateISOTZ,
} from "../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../utils/names/toPatientName";
import EmptyParagraph from "../../../UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import ClinicalNotesCardPrint from "../ClinicalNotes/ClinicalNotesCardPrint";

const ClinicalNotesPU = ({
  demographicsInfos,
  clinicalNotes,
  checkedNotes,
  selectAll,
  order,
  setCheckedNotes,
}) => {
  const [clinicalNotesToPrint, setClinicalNotesToPrint] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAllClinicalNotes = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const response = await xanoGet("/clinical_notes_of_patient", "staff", {
          patient_id: parseInt(id),
          orderBy: order,
          columnName: "date_created",
          search: "",
        });
        if (abortController.signal.aborted) return;
        setClinicalNotesToPrint(response.data.items);
        setCheckedNotes(response.data.items.map(({ id }) => id));
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.name !== "CanceledError") {
          setErrMsg(err.message);
        }
      }
    };
    if (!selectAll) {
      setClinicalNotesToPrint(clinicalNotes);
    } else {
      fetchAllClinicalNotes();
    }
    return () => abortController.abort();
  }, [clinicalNotes, id, order, selectAll, setCheckedNotes]);

  const handlePrint = (e) => {
    e.nativeEvent.view.print();
  };
  return (
    <div className="clinical-notes__print-page">
      {errMsg && <p className="clinical-notes__print-page__err">{errMsg}</p>}
      {!errMsg && (
        <>
          <p
            style={{
              fontSize: "0.85rem",
              fontFamily: "Arial",
              marginLeft: "5px",
            }}
          >
            <em>
              {toPatientName(demographicsInfos)},{" "}
              {toCodeTableName(genderCT, demographicsInfos.Gender)},{" "}
              {getAgeTZ(demographicsInfos.DateOfBirth)}, born{" "}
              {timestampToDateISOTZ(demographicsInfos.DateOfBirth)}, Chart Nbr:{" "}
              {demographicsInfos.ChartNumber},{" "}
              <i className="fa-regular fa-envelope fa-sm"></i>{" "}
              {demographicsInfos.Email},{" "}
              <i className="fa-solid fa-phone fa-sm"></i>{" "}
              {
                demographicsInfos.PhoneNumber?.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "C"
                )?.phoneNumber
              }
            </em>
          </p>
          {clinicalNotesToPrint.length > 0
            ? clinicalNotesToPrint
                .filter(({ id }) => checkedNotes.includes(id))
                .map((clinicalNote) => (
                  <ClinicalNotesCardPrint
                    clinicalNote={clinicalNote}
                    key={clinicalNote.id}
                  />
                ))
            : !loading && (
                <EmptyParagraph
                  style={{ fontFamily: "Arial" }}
                  text="No Clinical notes to print"
                />
              )}
          {loading && <LoadingParagraph style={{ fontFamily: "Arial" }} />}
          <p style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{ width: "100px" }}
              className="clinical-notes__print-page-btn"
            >
              Print
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default ClinicalNotesPU;
