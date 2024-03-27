import React, { useRef, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { genderCT, toCodeTableName } from "../../../../../omdDatas/codesTables";
import { getAgeTZ } from "../../../../../utils/dates/formatDates";
import ToastCalvin from "../../../../UI/Toast/ToastCalvin";
import StaffAIAgreement from "../../../Agreement/StaffAIAgreement";
import CalvinAIDiscussion from "./CalvinAIDiscussion";
import CalvinAIPrompt from "./CalvinAIPrompt";

const CalvinAI = ({ attachments, initialBody, demographicsInfos }) => {
  const { user } = useUserContext();
  const [chatVisible, setChatVisible] = useState(false);
  const [start, setStart] = useState(user.ai_consent);

  const [msgText, setMsgText] = useState({
    intro: `Hello I'm a doctor. My patient is a ${getAgeTZ(
      demographicsInfos.DateOfBirth
    )} year-old ${toCodeTableName(
      genderCT,
      demographicsInfos.Gender
    )} with the following symptoms:`,
    body: initialBody,
    attachments: "Here are further informations that you may use: ",
    reports: "",
    question: "What is the diagnosis and what treatment would you suggest ?",
  });
  const [introMsg, setIntroMsg] = useState(
    `Hello I'm a doctor. My patient is a ${getAgeTZ(
      demographicsInfos.DateOfBirth
    )} year-old ${toCodeTableName(
      genderCT,
      demographicsInfos.Gender
    )} with the following symptoms:`
  );

  const [messages, setMessages] = useState([
    {
      role: "user",
      content: "",
    },
  ]);
  const [lastResponse, setLastResponse] = useState("");
  const abortControllerAI = useRef(null);

  return (
    <>
      {!chatVisible ? (
        <CalvinAIPrompt
          messages={messages}
          setMessages={setMessages}
          setChatVisible={setChatVisible}
          setLastResponse={setLastResponse}
          abortController={abortControllerAI}
          attachments={attachments}
          initialBody={initialBody}
          demographicsInfos={demographicsInfos}
          introMsg={introMsg}
          setIntroMsg={setIntroMsg}
          msgText={msgText}
          setMsgText={setMsgText}
        />
      ) : !start ? (
        <StaffAIAgreement setStart={setStart} setChatVisible={setChatVisible} />
      ) : (
        <CalvinAIDiscussion
          messages={messages}
          setMessages={setMessages}
          lastResponse={lastResponse}
          setLastResponse={setLastResponse}
          abortController={abortControllerAI}
        />
      )}
      <ToastCalvin id="B" />
    </>
  );
};

export default CalvinAI;
