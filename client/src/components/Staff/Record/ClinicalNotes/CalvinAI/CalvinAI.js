import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { axiosXanoStaff } from "../../../../../api/xanoStaff";
import useAuthContext from "../../../../../hooks/useAuthContext";
import { getAge } from "../../../../../utils/getAge";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";
import StaffAIAgreement from "../../../Agreement/StaffAIAgreement";
import CalvinAIDiscussion from "./CalvinAIDiscussion";
import CalvinAIPrompt from "./CalvinAIPrompt";

const CalvinAI = ({ attachments, initialBody, demographicsInfos }) => {
  const { user, auth } = useAuthContext();
  const [chatVisible, setChatVisible] = useState(false);
  const [start, setStart] = useState(false);
  const [messages, setMessages] = useState([
    {
      content: `Hello I'm a doctor.

My patient is a ${getAge(demographicsInfos.date_of_birth)} year-old ${
        demographicsInfos.gender_at_birth
      } with the following symptoms:
    
  ${initialBody}.
    
What is the diagnosis and what treatment would you suggest ?`,
      role: "user",
    },
  ]);
  const [lastResponse, setLastResponse] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const abortControllerAI = useRef(null);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchStaffInfos = async () => {
      try {
        const response = await axiosXanoStaff.get(`/staff/${user.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        setIsLoading(false);
        setStart(response.data.ai_consent);
      } catch (err) {
        toast.error(`Cant fetch staff ai consent: ${err.message}`, {
          containerId: "A",
        });
      }
    };
    fetchStaffInfos();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken, user.id]);

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
        />
      ) : isLoading ? (
        <CircularProgressMedium />
      ) : start ? (
        <CalvinAIDiscussion
          messages={messages}
          setMessages={setMessages}
          lastResponse={lastResponse}
          setLastResponse={setLastResponse}
          abortController={abortControllerAI}
        />
      ) : (
        <StaffAIAgreement setStart={setStart} setChatVisible={setChatVisible} />
      )}
      <ToastContainer
        enableMultiContainer
        containerId={"B"}
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
    </>
  );
};

export default CalvinAI;
