import React, { useState } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import CircularProgressSmall from "../../../../All/UI/Progress/CircularProgressSmall";
import AddAIReportItem from "./AddAIReportItem";

const AddAIReports = ({
  reports,
  loadingReports,
  errMsgReports,
  setPaging,
  hasMoreReports,
  demographicsInfos,
  isLoadingReportText,
  setIsLoadingReportText,
  isLoadingAttachmentText,
  reportsTextToAdd,
  setReportsTextsToAdd,
  msgText,
  setMsgText,
}) => {
  const [reportsAddedIds, setReportsAddedIds] = useState([]);
  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
    loadingReports,
    hasMoreReports,
    setPaging
  );

  return (
    <div className="calvinai-prompt__reports" ref={rootRef}>
      <p>
        Add reports datas
        {isLoadingReportText && <CircularProgressSmall />}
      </p>
      {errMsgReports && <p>{errMsgReports}</p>}
      <ul>
        {reports.map((report, index) =>
          index === reports.length - 1 ? (
            <AddAIReportItem
              key={report.id}
              report={report}
              reportsAddedIds={reportsAddedIds}
              setReportsAddedIds={setReportsAddedIds}
              reportsTextToAdd={reportsTextToAdd}
              setReportsTextsToAdd={setReportsTextsToAdd}
              demographicsInfos={demographicsInfos}
              isLoadingReportText={isLoadingReportText}
              setIsLoadingReportText={setIsLoadingReportText}
              isLoadingAttachmentText={isLoadingAttachmentText}
              msgText={msgText}
              setMsgText={setMsgText}
              lastItemRef={lastItemRef}
            />
          ) : (
            <AddAIReportItem
              key={report.id}
              report={report}
              reportsAddedIds={reportsAddedIds}
              setReportsAddedIds={setReportsAddedIds}
              reportsTextToAdd={reportsTextToAdd}
              setReportsTextsToAdd={setReportsTextsToAdd}
              demographicsInfos={demographicsInfos}
              isLoadingReportText={isLoadingReportText}
              setIsLoadingReportText={setIsLoadingReportText}
              isLoadingAttachmentText={isLoadingAttachmentText}
              msgText={msgText}
              setMsgText={setMsgText}
            />
          )
        )}
        {loadingReports && <li>Loading...</li>}
      </ul>
    </div>
  );
};

export default AddAIReports;
