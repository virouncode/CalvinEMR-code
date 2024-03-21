import React, { useRef, useState } from "react";
import useFetchCategoryDatas from "../../../../hooks/useFetchCategoryDatas";
import useIntersection from "../../../../hooks/useIntersection";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import EmptyRow from "../../../All/UI/Tables/EmptyRow";
import LoadingRow from "../../../All/UI/Tables/LoadingRow";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import ReportForm from "../Topics/Reports/ReportForm";
import ReportItemReceived from "../Topics/Reports/ReportItemReceived";
import ReportItemSent from "../Topics/Reports/ReportItemSent";

const ReportsPU = ({
  reportsReceived,
  setReportsReceived,
  loadingReportsReceived,
  setLoadingReportsReceived,
  errMsgReportsReceived,
  setErrMsgReportsReceived,
  pagingReportsReceived,
  setPagingReportsReceived,
  hasMoreReportsReceived,
  setHasMoreReportsReceived,
  reportsSent,
  setReportsSent,
  loadingReportsSent,
  setLoadingReportsSent,
  errMsgReportsSent,
  setErrMsgReportsSent,
  pagingReportsSent,
  setPagingReportsSent,
  hasMoreReportsSent,
  setHasMoreReportsSent,
  patientId,
  setPopUpVisible,
  demographicsInfos,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  useFetchCategoryDatas(
    "/reports_received_of_patient",
    setReportsReceived,
    setLoadingReportsReceived,
    setErrMsgReportsReceived,
    pagingReportsReceived,
    setHasMoreReportsReceived,
    patientId
  );

  useFetchCategoryDatas(
    "/reports_sent_of_patient",
    setReportsSent,
    setLoadingReportsSent,
    setErrMsgReportsSent,
    pagingReportsSent,
    setHasMoreReportsSent,
    patientId
  );

  //INTERSECTION OBSERVER
  const { rootRef: rootReceivedRef, lastItemRef: lastItemReceivedRef } =
    useIntersection(
      loadingReportsReceived,
      hasMoreReportsReceived,
      setPagingReportsReceived
    );
  const { rootRef: rootSentRef, lastItemRef: lastItemSentRef } =
    useIntersection(
      loadingReportsSent,
      hasMoreReportsSent,
      setPagingReportsSent
    );

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
      <h1 className="reports__title">
        Patient reports <i className="fa-regular fa-folder"></i>
      </h1>
      {errMsgPost && <div className="reports__err">{errMsgPost}</div>}
      <h2 className="reports__title reports__title--subtitle">Received</h2>
      {errMsgReportsReceived && (
        <div className="reports__err">{errMsgReportsReceived}</div>
      )}
      {!errMsgReportsReceived && (
        <div className="reports__table-container" ref={rootReceivedRef}>
          <table className="reports__table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Name</th>
                <th>Format</th>
                <th>File extension and version</th>
                <th>File</th>
                <th>Class</th>
                <th>Subclass</th>
                <th>Date of document</th>
                <th>Date received</th>
                <th>Author</th>
                <th>Reviewed by</th>
                <th>Date reviewed</th>
                <th>Notes</th>
                <th>Updated by</th>
                <th>Updated on</th>
              </tr>
            </thead>
            <tbody>
              {reportsReceived && reportsReceived.length > 0
                ? reportsReceived.map((item, index) =>
                    index === reportsReceived.length - 1 ? (
                      <ReportItemReceived
                        item={item}
                        lastItemReceivedRef={lastItemReceivedRef}
                      />
                    ) : (
                      <ReportItemReceived item={item} key={item.id} />
                    )
                  )
                : !loadingReportsReceived && (
                    <EmptyRow colSpan="15" text="No reports received" />
                  )}
              {loadingReportsReceived && <LoadingRow colSpan="15" />}
            </tbody>
          </table>
        </div>
      )}
      <h2 className="reports__title reports__title--subtitle">Sent</h2>
      {errMsgReportsSent && (
        <div className="pasthealth__err">{errMsgReportsSent}</div>
      )}
      {!errMsgReportsSent && (
        <div className="reports__table-container" ref={rootSentRef}>
          <table className="reports__table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Name</th>
                <th>Format</th>
                <th>File extension and version</th>
                <th>File</th>
                <th>Class</th>
                <th>Subclass</th>
                <th>Date of document</th>
                <th>Date sent</th>
                <th>Author</th>
                <th>Recipient</th>
                <th>Notes</th>
                <th>Updated by</th>
                <th>Updated on</th>
              </tr>
            </thead>
            <tbody>
              {reportsSent && reportsSent.length > 0
                ? reportsSent.map((item, index) =>
                    index === reportsSent.length - 1 ? (
                      <ReportItemSent
                        item={item}
                        key={item.id}
                        lastItemSentRef={lastItemSentRef}
                      />
                    ) : (
                      <ReportItemSent item={item} key={item.id} />
                    )
                  )
                : !loadingReportsSent && (
                    <EmptyRow colSpan="15" text="No reports sent" />
                  )}
              {loadingReportsSent && <LoadingRow colSpan="15" />}
            </tbody>
          </table>
        </div>
      )}
      <div className="reports__btn-container">
        <button disabled={addVisible} onClick={handleAdd}>
          Add
        </button>
        <button onClick={handleClose}>Close</button>
      </div>
      {addVisible && (
        <FakeWindow
          title={"ADD TO PATIENT REPORTS"}
          width={1000}
          height={550}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#931621"
          setPopUpVisible={setAddVisible}
        >
          <ReportForm
            patientId={patientId}
            setAddVisible={setAddVisible}
            editCounter={editCounter}
            setErrMsgPost={setErrMsgPost}
            demographicsInfos={demographicsInfos}
            errMsgPost={errMsgPost}
          />
        </FakeWindow>
      )}
      <ConfirmGlobal isPopUp={true} />
      <ToastCalvin id="B" />
    </>
  );
};

export default ReportsPU;
