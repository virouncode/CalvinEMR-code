import React, { useRef, useState } from "react";
import useFetchCategoryDatas from "../../../../hooks/useFetchCategoryDatas";
import useIntersection from "../../../../hooks/useIntersection";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import EmptyRow from "../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../UI/Tables/LoadingRow";
import ToastCalvin from "../../../UI/Toast/ToastCalvin";
import ProblemListForm from "../Topics/ProblemList/ProblemListForm";
import ProblemListItem from "../Topics/ProblemList/ProblemListItem";

const ProblemListPU = ({
  topicDatas,
  setTopicDatas,
  loading,
  setLoading,
  errMsg,
  setErrMsg,
  hasMore,
  setHasMore,
  paging,
  setPaging,
  patientId,
  setPopUpVisible,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  useFetchCategoryDatas(
    "/problemlist_of_patient",
    setTopicDatas,
    setLoading,
    setErrMsg,
    paging,
    setHasMore,
    patientId
  );

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
      <h1 className="problemlist__title">
        Patient problem list{" "}
        <i className="fa-solid fa-triangle-exclamation"></i>
      </h1>
      {errMsgPost && <div className="problemlist__err">{errMsgPost}</div>}
      {errMsg && <div className="problemlist__err">{errMsg}</div>}

      {!errMsg && (
        <>
          <div className="problemlist__table-container" ref={rootRef}>
            <table className="problemlist__table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Diagnosis Description</th>
                  <th>Problem Description</th>
                  <th>Status</th>
                  <th>Onset date</th>
                  <th>Life stage</th>
                  <th>Resolution date</th>
                  <th>Notes</th>
                  <th>Updated By</th>
                  <th>Updated On</th>
                </tr>
              </thead>
              <tbody>
                {addVisible && (
                  <ProblemListForm
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
                        <ProblemListItem
                          item={item}
                          key={item.id}
                          editCounter={editCounter}
                          setErrMsgPost={setErrMsgPost}
                          errMsgPost={errMsgPost}
                          lastItemRef={lastItemRef}
                        />
                      ) : (
                        <ProblemListItem
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
                      <EmptyRow colSpan="10" text="No problem list" />
                    )}
                {loading && <LoadingRow colSpan="10" />}
              </tbody>
            </table>
          </div>
          <div className="problemlist__btn-container">
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

export default ProblemListPU;
