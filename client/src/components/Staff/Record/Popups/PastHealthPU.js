import React, { useRef, useState } from "react";
import useIntersection from "../../../../hooks/useIntersection";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import EmptyRow from "../../../All/UI/Tables/EmptyRow";
import LoadingRow from "../../../All/UI/Tables/LoadingRow";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import PastHealthForm from "../Topics/PastHealth/PastHealthForm";
import PastHealthItem from "../Topics/PastHealth/PastHealthItem";

const PastHealthPU = ({
  topicDatas,
  hasMore,
  loading,
  errMsg,
  setPaging,
  patientId,
  setPopUpVisible,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

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
  const handleAdd = (e) => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  return (
    <>
      <h1 className="pasthealth__title">
        Patient past health <i className="fa-solid fa-laptop-medical"></i>
      </h1>
      {errMsgPost && <div className="pasthealth__err">{errMsgPost}</div>}
      {errMsg && <div className="pasthealth__err">{errMsg}</div>}
      {!errMsg && (
        <>
          <div className="pasthealth__table-container" ref={rootRef}>
            <table className="pasthealth__table">
              <thead>
                <tr>
                  <th>Description/Procedure</th>
                  <th>Onset date</th>
                  <th>Life Stage</th>
                  <th>Procedure date</th>
                  <th>Resolved date</th>
                  <th>Problem status</th>
                  <th>Notes</th>
                  <th>Updated By</th>
                  <th>Updated On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {addVisible && (
                  <PastHealthForm
                    editCounter={editCounter}
                    setAddVisible={setAddVisible}
                    patientId={patientId}
                    setErrMsgPost={setErrMsgPost}
                    errMsgPost={errMsgPost}
                  />
                )}
                {topicDatas && topicDatas.length > 0
                  ? topicDatas.map((item, index) =>
                      index === topicDatas.length - 1 ? (
                        <PastHealthItem
                          item={item}
                          key={item.id}
                          editCounter={editCounter}
                          setErrMsgPost={setErrMsgPost}
                          errMsgPost={errMsgPost}
                          lastItemRef={lastItemRef}
                        />
                      ) : (
                        <PastHealthItem
                          item={item}
                          key={item.id}
                          editCounter={editCounter}
                          setErrMsgPost={setErrMsgPost}
                          errMsgPost={errMsgPost}
                        />
                      )
                    )
                  : !loading &&
                    !addVisible && (
                      <EmptyRow colSpan="10" text="No past health" />
                    )}
                {loading && <LoadingRow colSpan="10" />}
              </tbody>
            </table>
          </div>
          <div className="pasthealth__btn-container">
            <button onClick={handleAdd} disabled={addVisible}>
              Add
            </button>
            <button onClick={handleClose}>Close</button>
          </div>
        </>
      )}
      <ConfirmGlobal isPopUp={true} />
      <ToastCalvin id="B" />
    </>
  );
};

export default PastHealthPU;
