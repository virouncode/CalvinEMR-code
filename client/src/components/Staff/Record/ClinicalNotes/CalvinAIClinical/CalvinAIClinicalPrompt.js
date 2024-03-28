import React, { useState } from "react";
import { toast } from "react-toastify";
import { sendMsgToOpenAI } from "../../../../../api/openapi";
import useFetchTopicDatas from "../../../../../hooks/useFetchTopicDatas";
import AddAIAttachments from "./AddAIAttachments";
import AddAIReports from "./AddAIReports";

const CalvinAIClinicalPrompt = ({
  messages,
  setMessages,
  setChatVisible,
  setLastResponse,
  abortController,
  attachments,
  demographicsInfos,
  msgText,
  setMsgText,
}) => {
  const [isLoadingAttachmentText, setIsLoadingAttachmentText] = useState(false);
  const [isLoadingReportText, setIsLoadingReportText] = useState(false);
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 5,
    offset: 0,
  });
  const {
    topicDatas: reports,
    loading: loadingReports,
    errMsg: errMsgReports,
    hasMore: hasMoreReports,
  } = useFetchTopicDatas(
    "/reports_of_patient",
    paging,
    demographicsInfos.patient_id
  );

  const [attachmentsTextsToAdd, setAttachmentsTextsToAdd] = useState([]);
  const [reportsTextToAdd, setReportsTextsToAdd] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setMsgText({ ...msgText, [name]: value });
  };

  const handleSubmit = async () => {
    const updatedMessages = [
      {
        role: "user",
        content:
          msgText.intro +
          "\n\n" +
          msgText.body +
          "\n\n" +
          msgText.attachments +
          "\n\n" +
          msgText.reports +
          "\n\n" +
          msgText.question,
      },
      { role: "assistant", content: "" },
    ];
    setChatVisible(true);
    try {
      abortController.current = new AbortController();
      const stream = await sendMsgToOpenAI(
        [
          {
            role: "user",
            content:
              msgText.intro +
              msgText.body +
              msgText.attachments +
              msgText.reports +
              msgText.question,
          },
        ],
        abortController.current
      );
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
      <label htmlFor="">Introduction</label>
      <textarea
        className="calvinai-prompt__intro-textarea"
        onChange={handleChange}
        value={msgText.intro}
        name="intro"
      />
      <label htmlFor="">Symptoms</label>
      <textarea
        className="calvinai-prompt__body-textarea"
        onChange={handleChange}
        value={msgText.body}
        name="body"
      />
      <label htmlFor="">Attachments infos (read-only)</label>
      <textarea
        className="calvinai-prompt__attachments-textarea"
        readOnly
        value={msgText.attachments}
      />
      <label htmlFor="">Reports infos (read-only)</label>
      <textarea
        className="calvinai-prompt__reports-textarea"
        readOnly
        value={msgText.reports}
      />
      <label htmlFor="">Question</label>
      <textarea
        className="calvinai-prompt__conclusion-textarea"
        onChange={handleChange}
        value={msgText.question}
        name="question"
      />
      <div className="calvinai-prompt__footer">
        <div className="calvinai-prompt__add">
          {attachments.length ? (
            <AddAIAttachments
              attachments={attachments}
              demographicsInfos={demographicsInfos}
              isLoadingAttachmentText={isLoadingAttachmentText}
              setIsLoadingAttachmentText={setIsLoadingAttachmentText}
              isLoadingReportText={isLoadingReportText}
              attachmentsTextsToAdd={attachmentsTextsToAdd}
              setAttachmentsTextsToAdd={setAttachmentsTextsToAdd}
              msgText={msgText}
              setMsgText={setMsgText}
            />
          ) : null}
          {reports.length > 0 ? (
            <AddAIReports
              reports={reports}
              loadingReports={loadingReports}
              errMsgReports={errMsgReports}
              setPaging={setPaging}
              hasMoreReports={hasMoreReports}
              demographicsInfos={demographicsInfos}
              isLoadingReportText={isLoadingReportText}
              setIsLoadingReportText={setIsLoadingReportText}
              isLoadingAttachmentText={isLoadingAttachmentText}
              reportsTextToAdd={reportsTextToAdd}
              setReportsTextsToAdd={setReportsTextsToAdd}
              msgText={msgText}
              setMsgText={setMsgText}
            />
          ) : null}
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoadingAttachmentText || isLoadingReportText}
        >
          Submit to CalvinAI
        </button>
      </div>
    </div>
  );
};

export default CalvinAIClinicalPrompt;
