import React, { useRef, useState } from "react";
import useIntersection from "../../../../hooks/useIntersection";
import useUserContext from "../../../../hooks/useUserContext";
import { toPatientName } from "../../../../utils/toPatientName";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import EmptyRow from "../../../All/UI/Tables/EmptyRow";
import LoadingRow from "../../../All/UI/Tables/LoadingRow";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import { default as MedicationItem } from "../Topics/Medications/MedicationItem";
import PrescriptionPU from "./PrescriptionPU";

const MedicationsPU = ({
  topicDatas,
  hasMore,
  loading,
  errMsg,
  setPaging,
  patientId,
  setPopUpVisible,
  demographicsInfos,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const editCounter = useRef(0);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [presVisible, setPresVisible] = useState(false);

  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  //HANDLERS
  const handleClose = async (e) => {
    if (
      editCounter.current === 0 ||
      (editCounter.current > 0 &&
        (await confirmAlert({
          content:
            "Do you really want to close the window ? Your changes will be lost",
        })))
    ) {
      setPopUpVisible(false);
    }
  };
  const handleNewRX = (e) => {
    setErrMsgPost("");
    setPresVisible((v) => !v);
  };

  return (
    <>
      <h1 className="medications__title">
        Patient medications and treatments <i className="fa-solid fa-pills"></i>
      </h1>
      {errMsgPost && <div className="medications__err">{errMsgPost}</div>}
      {errMsg && <div className="medications__err">{errMsg}</div>}
      {!errMsg && (
        <>
          <div className="medications__table-container" ref={rootRef}>
            <table className="medications__table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Drug name</th>
                  <th>Strength</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Updated By</th>
                  <th>Updated On</th>
                  <th style={{ textDecoration: "none", cursor: "default" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {topicDatas && topicDatas.length > 0
                  ? topicDatas.map(
                      (item, index) =>
                        (index =
                          topicDatas.length - 1 ? (
                            <MedicationItem
                              item={item}
                              key={item.id}
                              patientId={patientId}
                              lastItemRef={lastItemRef}
                            />
                          ) : (
                            <MedicationItem
                              item={item}
                              key={item.id}
                              patientId={patientId}
                            />
                          ))
                    )
                  : !loading && <EmptyRow colSpan="10" text="No medications" />}
                {loading && <LoadingRow colSpan="10" />}
              </tbody>
            </table>
          </div>
          <div className="medications__btn-container">
            {user.title === "Doctor" && (
              <button onClick={handleNewRX}>New RX</button>
            )}
            <button onClick={handleClose}>Close</button>
          </div>
        </>
      )}
      {presVisible && (
        <FakeWindow
          title={`NEW PRESCRIPTION to ${toPatientName(demographicsInfos)}`}
          width={1400}
          height={750}
          x={(window.innerWidth - 1400) / 2}
          y={(window.innerHeight - 750) / 2}
          color="#931621"
          setPopUpVisible={setPresVisible}
        >
          <PrescriptionPU
            demographicsInfos={demographicsInfos}
            setPresVisible={setPresVisible}
            patientId={patientId}
          />
        </FakeWindow>
      )}
      <ConfirmGlobal isPopUp={true} />
      <ToastCalvin id="B" />
    </>
  );
};

export default MedicationsPU;
