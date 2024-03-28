import React, { useRef, useState } from "react";
import useFetchCategoryDatas from "../../../../../hooks/useFetchCategoryDatas";
import useIntersection from "../../../../../hooks/useIntersection";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../../All/Confirm/ConfirmGlobal";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import LoadingRow from "../../../../UI/Tables/LoadingRow";
import ToastCalvin from "../../../../UI/Toast/ToastCalvin";
import AllergyForm from "./AllergyForm";
import AllergyItem from "./AllergyItem";

const AllergiesPU = ({
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
    "/allergies_of_patient",
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
      <h1 className="allergies__title">
        Patient allergies & adverse reactions{" "}
        <i className="fa-solid fa-hand-dots"></i>
      </h1>
      {errMsgPost && <div className="allergies__err">{errMsgPost}</div>}
      {errMsg && <div className="allergies__err">{errMsg}</div>}
      {!errMsg && (
        <>
          <div className="pasthealth__table-container" ref={rootRef}>
            <table className="allergies__table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Offending agent</th>
                  <th>Type of agent</th>
                  <th>Reaction type</th>
                  <th>Start date</th>
                  <th>Life stage</th>
                  <th>Severity</th>
                  <th>Reaction</th>
                  <th>Recorded date</th>
                  <th>Notes</th>
                  <th>Updated By</th>
                  <th>Updated On</th>
                </tr>
              </thead>
              <tbody>
                {addVisible && (
                  <AllergyForm
                    editCounter={editCounter}
                    setAddVisible={setAddVisible}
                    patientId={patientId}
                    setErrMsgPost={setErrMsgPost}
                    errMsgPost={errMsgPost}
                  />
                )}
                {topicDatas && topicDatas.length > 0
                  ? topicDatas.map((allergy, index) =>
                      index === topicDatas.length - 1 ? (
                        <AllergyItem
                          item={allergy}
                          key={allergy.id}
                          editCounter={editCounter}
                          setErrMsgPost={setErrMsgPost}
                          errMsgPost={errMsgPost}
                          lastItemRef={lastItemRef}
                        />
                      ) : (
                        <AllergyItem
                          item={allergy}
                          key={allergy.id}
                          editCounter={editCounter}
                          setErrMsgPost={setErrMsgPost}
                          errMsgPost={errMsgPost}
                        />
                      )
                    )
                  : !loading &&
                    !addVisible && (
                      <EmptyRow colSpan="12" text="No allergies" />
                    )}
                {loading && <LoadingRow colSpan="12" />}
              </tbody>
            </table>
          </div>
          <div className="allergies__btn-container">
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

export default AllergiesPU;
