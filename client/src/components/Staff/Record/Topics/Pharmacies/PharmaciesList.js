import React, { useState } from "react";
import useFetchCategoryDatas from "../../../../../hooks/useFetchCategoryDatas";
import useIntersection from "../../../../../hooks/useIntersection";
import EmptyRow from "../../../../All/UI/Tables/EmptyRow";
import LoadingRow from "../../../../All/UI/Tables/LoadingRow";
import PharmacyForm from "./PharmacyForm";
import PharmacyItem from "./PharmacyItem";

const PharmaciesList = ({
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
  editCounter,
  demographicsInfos,
}) => {
  //HOOKS
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  useFetchCategoryDatas(
    "/pharmacies",
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
  const handleAddNewClick = () => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  return (
    <>
      <div className="pharmacies-list__title">
        Pharmacies database
        <button onClick={handleAddNewClick}>
          Add a new Pharmacy to database
        </button>
      </div>
      {errMsgPost && <div className="pharmacies-list__err">{errMsgPost}</div>}
      {errMsg && <div className="pharmacies-list__err">{errMsg}</div>}
      {!errMsg && (
        <div className="pharmacies-list__table-container" ref={rootRef}>
          <table className="pharmacies-list__table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Name</th>
                <th>Address</th>
                <th>City</th>
                <th>Province/State</th>
                <th>Postal/Zip Code</th>
                <th>Phone</th>
                <th>Fax</th>
                <th>Email</th>
                <th>Updated By</th>
                <th>Updated On</th>
              </tr>
            </thead>
            <tbody>
              {addVisible && (
                <PharmacyForm
                  editCounter={editCounter}
                  setAddVisible={setAddVisible}
                  setErrMsgPost={setErrMsgPost}
                  errMsgPost={errMsgPost}
                />
              )}
              {topicDatas && topicDatas.length > 0
                ? topicDatas.map((item, index) =>
                    index === topicDatas.length - 1 ? (
                      <PharmacyItem
                        item={item}
                        key={item.id}
                        editCounter={editCounter}
                        setErrMsgPost={setErrMsgPost}
                        errMsgPost={errMsgPost}
                        lastItemRef={lastItemRef}
                        demographicsInfos={demographicsInfos}
                      />
                    ) : (
                      <PharmacyItem
                        item={item}
                        key={item.id}
                        editCounter={editCounter}
                        setErrMsgPost={setErrMsgPost}
                        errMsgPost={errMsgPost}
                        demographicsInfos={demographicsInfos}
                      />
                    )
                  )
                : !loading &&
                  !addVisible && (
                    <EmptyRow colSpan="11" text="Doctors database empty" />
                  )}
              {loading && <LoadingRow colSpan="11" />}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default PharmaciesList;
