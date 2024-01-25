import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import AddAIReportItem from "./AddAIReportItem";

const AddAIReports = ({
  reports,
  messages,
  setMessages,
  demographicsInfos,
  initialBody,
  isLoadingDocumentText,
  setIsLoadingDocumentText,
  isLoadingAttachmentText,
  reportsTextToAdd,
  setReportsTextsToAdd,
  attachmentsTextsToAdd,
}) => {
  const [documentsAddedIds, setDocumentsAddedIds] = useState([]);

  return (
    <div className="calvinai-prompt__documents">
      <p>
        Add reports datas
        {isLoadingDocumentText && (
          <CircularProgress size="0.8rem" style={{ marginLeft: "5px" }} />
        )}
      </p>
      {reports.map((report) => (
        <AddAIReportItem
          report={report}
          setMessages={setMessages}
          messages={messages}
          key={report.id}
          documentsAddedIds={documentsAddedIds}
          setDocumentsAddedIds={setDocumentsAddedIds}
          reportsTextToAdd={reportsTextToAdd}
          setReportsTextsToAdd={setReportsTextsToAdd}
          attachmentsTextsToAdd={attachmentsTextsToAdd}
          demographicsInfos={demographicsInfos}
          initialBody={initialBody}
          isLoadingDocumentText={isLoadingDocumentText}
          setIsLoadingDocumentText={setIsLoadingDocumentText}
          isLoadingAttachmentText={isLoadingAttachmentText}
        />
      ))}
    </div>
  );
};

export default AddAIReports;
