import React, { useRef, useState } from "react";
import useIntersection from "../../../../hooks/useIntersection";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import EmptyRow from "../../../All/UI/Tables/EmptyRow";
import LoadingRow from "../../../All/UI/Tables/LoadingRow";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import AlertForm from "../Topics/Alerts/AlertForm";
import AlertItem from "../Topics/Alerts/AlertItem";

const AlertsPU = ({
  topicDatas,
  hasMore,
  loading,
  errMsg,
  setPaging,
  patientId,
  setPopUpVisible,
}) => {
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
      <h1 className="alerts__title">
        Alerts and special needs{" "}
        <i className="fa-solid fa-person-circle-question"></i>
      </h1>
      {errMsgPost && <div className="alerts__err">{errMsgPost}</div>}
      {errMsg && <div className="alerts__err">{errMsg}</div>}
      {!errMsg && (
        <>
          <div className="alerts__table-container" ref={rootRef}>
            <table className="alerts__table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Start date</th>
                  <th>End date</th>
                  <th>Notes</th>
                  <th>Updated By</th>
                  <th>Updated On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {addVisible && (
                  <AlertForm
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
                        <AlertItem
                          item={item}
                          key={item.id}
                          editCounter={editCounter}
                          setErrMsgPost={setErrMsgPost}
                          errMsgPost={errMsgPost}
                          lastItemRef={lastItemRef}
                        />
                      ) : (
                        <AlertItem
                          item={item}
                          key={item.id}
                          editCounter={editCounter}
                          setErrMsgPost={setErrMsgPost}
                          errMsgPost={errMsgPost}
                        />
                      )
                    )
                  : !loading &&
                    !addVisible && <EmptyRow colSpan="6" text="No alerts" />}
                {loading && <LoadingRow colSpan="6" />}
              </tbody>
            </table>
          </div>
          <div className="alerts__btn-container">
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

export default AlertsPU;
