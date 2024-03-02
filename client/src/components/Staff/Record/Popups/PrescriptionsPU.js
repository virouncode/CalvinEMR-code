import React from "react";
import useFetchCategoryDatas from "../../../../hooks/useFetchCategoryDatas";
import useIntersection from "../../../../hooks/useIntersection";
import EmptyRow from "../../../All/UI/Tables/EmptyRow";
import LoadingRow from "../../../All/UI/Tables/LoadingRow";
import PrescriptionItem from "../Topics/Prescriptions/PrescriptionItem";

const PrescriptionsPU = ({
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
  console.log("pagingPrescriptions in prescription PU", paging);
  useFetchCategoryDatas(
    "/prescriptions_of_patient",
    setTopicDatas,
    setLoading,
    setErrMsg,
    paging,
    setHasMore,
    patientId
  );

  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  const handleClose = async (e) => {
    setPopUpVisible(false);
  };

  return (
    <>
      <h1 className="prescriptions__title">
        Patient prescriptions <i className="fa-regular fa-newspaper"></i>
      </h1>
      {errMsg && <div className="prescriptions__err">{errMsg}</div>}
      {!errMsg && (
        <>
          <div className="prescriptions__table-container" ref={rootRef}>
            <table className="prescriptions__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Created By</th>
                  <th>Created On</th>
                </tr>
              </thead>
              <tbody>
                {topicDatas && topicDatas.length > 0
                  ? topicDatas.map((item, index) =>
                      index === topicDatas.length - 1 ? (
                        <PrescriptionItem
                          item={item}
                          key={item.id}
                          lastItemRef={lastItemRef}
                        />
                      ) : (
                        <PrescriptionItem item={item} key={item.id} />
                      )
                    )
                  : !loading && (
                      <EmptyRow colSpan="3" text="No prescriptions" />
                    )}
                {loading && <LoadingRow colSpan="3" />}
              </tbody>
            </table>
          </div>
          <div className="prescriptions__btn-container">
            <button onClick={handleClose}>Close</button>
          </div>
        </>
      )}
    </>
  );
};

export default PrescriptionsPU;
