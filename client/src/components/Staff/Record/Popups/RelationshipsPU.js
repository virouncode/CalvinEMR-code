import { useRef, useState } from "react";
import useIntersection from "../../../../hooks/useIntersection";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import EmptyRow from "../../../All/UI/Tables/EmptyRow";
import LoadingRow from "../../../All/UI/Tables/LoadingRow";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import RelationshipForm from "../Topics/Relationships/RelationshipForm";
import RelationshipItem from "../Topics/Relationships/RelationshipItem";

const RelationshipsPU = ({
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
      <h1 className="relationships__title">
        Patient relationships <i className="fa-solid fa-people-group"></i>
      </h1>
      {errMsgPost && <div className="relationships__err">{errMsgPost}</div>}
      {errMsg && <div className="relationships__err">{errMsg}</div>}
      {!errMsg && (
        <>
          <div className="relationships__table-container" ref={rootRef}>
            <table className="relationships__table">
              <thead>
                <tr>
                  <th>Relation</th>
                  <th>With Patient</th>
                  <th>Updated By</th>
                  <th>Updated On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {addVisible && (
                  <RelationshipForm
                    editCounter={editCounter}
                    setAddVisible={setAddVisible}
                    patientId={patientId}
                    setErrMsgPost={setErrMsgPost}
                    errMsgPost={errMsgPost}
                    demographicsInfos={demographicsInfos}
                  />
                )}
                {topicDatas && topicDatas.length > 0
                  ? topicDatas.map((item, index) =>
                      index === topicDatas.length - 1 ? (
                        <RelationshipItem
                          item={item}
                          key={item.id}
                          editCounter={editCounter}
                          setErrMsgPost={setErrMsgPost}
                          errMsgPost={errMsgPost}
                          lastItemRef={lastItemRef}
                          patientId={patientId}
                          demographicsInfos={demographicsInfos}
                        />
                      ) : (
                        <RelationshipItem
                          item={item}
                          key={item.id}
                          editCounter={editCounter}
                          setErrMsgPost={setErrMsgPost}
                          errMsgPost={errMsgPost}
                          patientId={patientId}
                          demographicsInfos={demographicsInfos}
                        />
                      )
                    )
                  : !loading &&
                    !addVisible && (
                      <EmptyRow colSpan="5" text="No relationships" />
                    )}
                {loading && <LoadingRow colSpan="5" />}
              </tbody>
            </table>
          </div>
          <div className="relationships__btn-container">
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

export default RelationshipsPU;
