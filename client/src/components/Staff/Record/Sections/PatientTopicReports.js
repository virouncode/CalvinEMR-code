import React, { useRef, useState } from "react";
import useFetchTopicDatas from "../../../../hooks/useFetchTopicDatas";
import useTopicSocket from "../../../../hooks/useTopicSocket";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import ReportsPU from "../Popups/ReportsPU";
import ReportsContent from "../Topics/Reports/ReportsContent";
import PatientTopicHeader from "./PatientTopicHeader";

const PatientTopicReports = ({
  textColor,
  backgroundColor,
  patientId,
  demographicsInfos,
  allContentsVisible,
  side,
  patientName,
}) => {
  //HOOKS
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef("null");

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //DATAS
  const [pagingReportsReceived, setPagingReportsReceived] = useState({
    page: 1,
    perPage: 2,
    offset: 0,
  });
  const [pagingReportsSent, setPagingReportsSent] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });
  const {
    topicDatas: reportsReceived,
    setTopicDatas: setReportsReceived,
    loading: loadingReportsReceived,
    errMsg: errMsgReportsReceived,
    hasMore: hasMoreReportsReceived,
  } = useFetchTopicDatas(
    "/reports_received_for_patient",
    pagingReportsReceived,
    patientId
  );
  const {
    topicDatas: reportsSent,
    setTopicDatas: setReportsSent,
    loading: loadingReportsSent,
    errMsg: errMsgReportsSent,
    hasMore: hasMoreReportsSent,
  } = useFetchTopicDatas(
    "/reports_sent_for_patient",
    pagingReportsSent,
    patientId
  );

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
    setPopUpVisible((v) => !v);
  };

  const handleTriangleClick = (e) => {
    e.target.classList.toggle("triangle--active");
    containerRef.current.classList.toggle(
      `patient-record__topic-container--active`
    );
  };

  return (
    <div className="patient-record__topic">
      <div
        className={`patient-record__topic-header patient-record__topic-header--${side}`}
        style={TOPIC_STYLE}
      >
        <PatientTopicHeader
          topic="REPORTS"
          handleTriangleClick={handleTriangleClick}
          handlePopUpClick={handlePopUpClick}
          allContentsVisible={allContentsVisible}
          popUpButton={true}
        />
      </div>
      <div
        className={
          allContentsVisible
            ? `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active`
            : `patient-record__topic-container patient-record__topic-container--${side} `
        }
        ref={containerRef}
      >
        <ReportsContent
          reportsReceived={reportsReceived}
          loadingReportsReceived={loadingReportsReceived}
          errMsgReportsReceived={errMsgReportsReceived}
          reportsSent={reportsSent}
          loadingReportsSent={loadingReportsSent}
          errMsgReportsSent={errMsgReportsSent}
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
              loadingReportsReceived={loadingReportsReceived}
              errMsgReportsReceived={errMsgReportsReceived}
              setPagingReportsReceived={setPagingReportsReceived}
              hasMoreReportsReceived={hasMoreReportsReceived}
              reportsSent={reportsSent}
              loadingReportsSent={loadingReportsSent}
              errMsgReportsSent={errMsgReportsSent}
              setPagingReportsSent={setPagingReportsSent}
              hasMoreReportsSent={hasMoreReportsSent}
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
