import React, { useRef, useState } from "react";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useFetchCategoryDatas from "../../../../hooks/useFetchCategoryDatas";
import useFetchDatas from "../../../../hooks/useFetchDatas";
import useIntersection from "../../../../hooks/useIntersection";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import EmptyRow from "../../../All/UI/Tables/EmptyRow";
import LoadingRow from "../../../All/UI/Tables/LoadingRow";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import AppointmentForm from "../Topics/Appointments/AppointmentForm";
import AppointmentItem from "../Topics/Appointments/AppointmentItem";

const AppointmentsPU = ({
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
  demographicsInfos,
}) => {
  //HOOKS
  const { auth } = useAuthContext();
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [sites, setSites] = useFetchDatas(
    "/sites",
    axiosXanoStaff,
    auth.authToken
  );

  useFetchCategoryDatas(
    "/appointments_of_patient",
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

  const handleAdd = async (e) => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  return (
    <>
      <h1 className="appointments__title">
        Patient appointments <i className="fa-regular fa-calendar-check"></i>
      </h1>
      {errMsgPost && <div className="appointments__err">{errMsgPost}</div>}
      {errMsg && <div className="appointments__err">{errMsg}</div>}
      {!errMsg && (
        <>
          <div className="appointments__table-container" ref={rootRef}>
            <table className="appointments__table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Host</th>
                  <th>Reason</th>
                  <th>From</th>
                  <th>To</th>
                  <th>All Day</th>
                  <th>Site</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Updated By</th>
                  <th>Updated On</th>
                </tr>
              </thead>
              <tbody>
                {addVisible && (
                  <AppointmentForm
                    patientId={patientId}
                    editCounter={editCounter}
                    demographicsInfos={demographicsInfos}
                    setAddVisible={setAddVisible}
                    errMsgPost={errMsgPost}
                    setErrMsgPost={setErrMsgPost}
                    sites={sites}
                  />
                )}
                {topicDatas && topicDatas.length > 0
                  ? topicDatas.map((item, index) =>
                      index === topicDatas.length - 1 ? (
                        <AppointmentItem
                          item={item}
                          key={item.id}
                          editCounter={editCounter}
                          errMsgPost={errMsgPost}
                          setErrMsgPost={setErrMsgPost}
                          sites={sites}
                          lastItemRef={lastItemRef}
                        />
                      ) : (
                        <AppointmentItem
                          item={item}
                          key={item.id}
                          editCounter={editCounter}
                          errMsgPost={errMsgPost}
                          setErrMsgPost={setErrMsgPost}
                          sites={sites}
                        />
                      )
                    )
                  : !loading &&
                    !addVisible && (
                      <EmptyRow colSpan="12" text="No appointments" />
                    )}
                {loading && <LoadingRow colSpan="12" />}
              </tbody>
            </table>
          </div>
          <div className="appointments__btn-container">
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

export default AppointmentsPU;
