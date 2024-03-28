import React, { useRef, useState } from "react";
import useTopicSocket from "../../../../hooks/socket/useTopicSocket";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import ReportsContent from "../Topics/Reports/ReportsContent";
import ReportsPU from "../Topics/Reports/ReportsPU";
import PatientTopicHeader from "./PatientTopicHeader";

const PatientTopicReports = ({
  textColor,
  backgroundColor,
  patientId,
  demographicsInfos,
  contentsVisible,
  patientName,
  side,
  reportsReceived,
  setReportsReceived,
  loadingReportsReceived,
  setLoadingReportsReceived,
  errReportsReceived,
  setErrReportsReceived,
  hasMoreReportsReceived,
  setHasMoreReportsReceived,
  pagingReportsReceived,
  setPagingReportsReceived,
  reportsSent,
  setReportsSent,
  loadingReportsSent,
  setLoadingReportsSent,
  errReportsSent,
  setErrReportsSent,
  hasMoreReportsSent,
  setHasMoreReportsSent,
  pagingReportsSent,
  setPagingReportsSent,
}) => {
  //HOOKS
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef(null);
  const triangleRef = useRef(null);

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //SOCKET
  useTopicSocket(
    "REPORTS RECEIVED",
    reportsReceived,
    setReportsReceived,
    patientId
  );
  useTopicSocket("REPORTS SENT", reportsSent, setReportsSent, patientId);

  //HANDLERS
  const handlePopUpClick = (e) => {
    e.stopPropagation();
    setPopUpVisible((v) => !v);
  };

  const handleTriangleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("triangle--active");
    containerRef.current.classList.toggle(
      `patient-record__topic-container--active`
    );
  };

  const handleClickHeader = () => {
    triangleRef.current.classList.toggle("triangle--active");
    containerRef.current.classList.toggle(
      `patient-record__topic-container--active`
    );
  };

  return (
    <div className="patient-record__topic">
      <div
        className={`patient-record__topic-header patient-record__topic-header--${side}`}
        style={TOPIC_STYLE}
        onClick={handleClickHeader}
      >
        <PatientTopicHeader
          topic="REPORTS"
          handleTriangleClick={handleTriangleClick}
          handlePopUpClick={handlePopUpClick}
          contentsVisible={contentsVisible}
          popUpButton="popUp"
          triangleRef={triangleRef}
        />
      </div>
      <div
        className={
          contentsVisible
            ? `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active`
            : `patient-record__topic-container patient-record__topic-container--${side} `
        }
        ref={containerRef}
      >
        <ReportsContent
          reportsReceived={reportsReceived}
          loadingReportsReceived={loadingReportsReceived}
          errMsgReportsReceived={errReportsReceived}
          reportsSent={reportsSent}
          loadingReportsSent={loadingReportsSent}
          errMsgReportsSent={errReportsSent}
        />
        {popUpVisible && (
          <FakeWindow
            title={`REPORTS about ${patientName}`}
            width={1400}
            height={750}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 750) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ReportsPU
              reportsReceived={reportsReceived}
              setReportsReceived={setReportsReceived}
              loadingReportsReceived={loadingReportsReceived}
              setLoadingReportsReceived={setLoadingReportsReceived}
              errMsgReportsReceived={errReportsReceived}
              setErrMsgReportsReceived={setErrReportsReceived}
              pagingReportsReceived={pagingReportsReceived}
              setPagingReportsReceived={setPagingReportsReceived}
              hasMoreReportsReceived={hasMoreReportsReceived}
              setHasMoreReportsReceived={setHasMoreReportsReceived}
              reportsSent={reportsSent}
              setReportsSent={setReportsSent}
              loadingReportsSent={loadingReportsSent}
              setLoadingReportsSent={setLoadingReportsSent}
              errMsgReportsSent={errReportsSent}
              setErrMsgReportsSent={setErrReportsSent}
              pagingReportsSent={pagingReportsSent}
              setPagingReportsSent={setPagingReportsSent}
              hasMoreReportsSent={hasMoreReportsSent}
              setHasMoreReportsSent={setHasMoreReportsSent}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
      </div>
    </div>
  );
};

export default PatientTopicReports;
