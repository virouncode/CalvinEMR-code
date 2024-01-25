import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sendMsgToOpenAI } from "../../../../../api/openapi";
import { axiosXanoStaff } from "../../../../../api/xanoStaff";
import useAuth from "../../../../../hooks/useAuth";
import AddAIAttachments from "./AddAIAttachments";
import AddAIReports from "./AddAIReports";

const CalvinAIPrompt = ({
  messages,
  setMessages,
  setChatVisible,
  setLastResponse,
  abortController,
  attachments,
  initialBody,
  demographicsInfos,
}) => {
  const { auth } = useAuth();
  const [isLoadingAttachmentText, setIsLoadingAttachmentText] = useState(false);
  const [isLoadingDocumentText, setIsLoadingDocumentText] = useState(false);
  const [reports, setReports] = useState([]);
  const [attachmentsTextsToAdd, setAttachmentsTextsToAdd] = useState([]);
  const [reportsTextToAdd, setReportsTextsToAdd] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchDocuments = async () => {
      try {
        const response = await axiosXanoStaff.get(
          `/reports_for_patient?patient_id=${demographicsInfos.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setReports(
          response.data.sort((a, b) => a.date_created - b.date_created)
        );
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error(`Unable to fetch patient reports: ${err.message}`, {
            containerId: "A",
          });
        }
      }
    };
    fetchDocuments();
    return () => abortController.abort();
  }, [auth.authToken, demographicsInfos.id]);

  const handleChange = (e) => {
    setMessages([{ role: "user", content: e.target.value }]);
  };
  const handleSubmit = async () => {
    const updatedMessages = [...messages];
    setChatVisible(true);
    updatedMessages.push({ role: "assistant", content: "" });
    try {
      abortController.current = new AbortController();
      const stream = await sendMsgToOpenAI(messages, abortController.current);
      for await (const part of stream) {
        updatedMessages[updatedMessages.length - 1].content +=
          part.choices[0]?.delta?.content || "";
        setMessages(updatedMessages);
        setLastResponse((r) => r + (part.choices[0]?.delta?.content || ""));
      }
    } catch (err) {
      toast.error(`CalvinAI is down: ${err.message}`, { containerId: "B" });
    }
  };
  return (
    <div className="calvinai-prompt">
      <h2 className="calvinai-prompt__title">
        Prepare prompt to CalvinAI <i className="fa-solid fa-robot"></i>
      </h2>
      <textarea
        className="calvinai-prompt__textarea"
        onChange={handleChange}
        value={messages[0].content}
      />
      <div className="calvinai-prompt__footer">
        <div className="calvinai-prompt__add">
          {attachments.length ? (
            <AddAIAttachments
              messages={messages}
              setMessages={setMessages}
              attachments={attachments}
              initialBody={initialBody}
              demographicsInfos={demographicsInfos}
              isLoadingAttachmentText={isLoadingAttachmentText}
              setIsLoadingAttachmentText={setIsLoadingAttachmentText}
              isLoadingDocumentText={isLoadingDocumentText}
              attachmentsTextsToAdd={attachmentsTextsToAdd}
              setAttachmentsTextsToAdd={setAttachmentsTextsToAdd}
              reportsTextToAdd={reportsTextToAdd}
            />
          ) : null}
          {reports.length ? (
            <AddAIReports
              messages={messages}
              setMessages={setMessages}
              reports={reports}
              initialBody={initialBody}
              demographicsInfos={demographicsInfos}
              isLoadingDocumentText={isLoadingDocumentText}
              setIsLoadingDocumentText={setIsLoadingDocumentText}
              isLoadingAttachmentText={isLoadingAttachmentText}
              reportsTextToAdd={reportsTextToAdd}
              setReportsTextsToAdd={setReportsTextsToAdd}
              attachmentsTextsToAdd={attachmentsTextsToAdd}
            />
          ) : null}
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoadingAttachmentText || isLoadingDocumentText}
        >
          Submit to CalvinAI
        </button>
      </div>
    </div>
  );
};

export default CalvinAIPrompt;
