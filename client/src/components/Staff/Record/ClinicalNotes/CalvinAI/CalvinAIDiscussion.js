import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { sendMsgToOpenAI } from "../../../../../api/openapi";
import CalvinAIInput from "../../../CalvinAIChat/CalvinAIInput";
import CalvinAIDiscussionContent from "./CalvinAIDiscussionContent";

const CalvinAIDiscussion = ({
  messages,
  setMessages,
  lastResponse,
  setLastResponse,
  abortController,
}) => {
  const msgEndRef = useRef(null);
  const contentRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll) {
      msgEndRef.current.scrollIntoView();
    }
  }, [autoScroll, lastResponse]);

  // Event handler for user scrolling.
  const handleMouseWheel = () => {
    setAutoScroll(false);
  };

  // Add a scroll event listener to the discussion feed.
  useEffect(() => {
    const currentContent = contentRef.current;
    currentContent.addEventListener("mousewheel", handleMouseWheel);
    return () => {
      currentContent.removeEventListener("mousewheel", handleMouseWheel);
    };
  }, []);

  const handleChangeInput = (e) => {
    setInputText(e.target.value);
  };
  const handleAskGPT = async () => {
    setAutoScroll(true);
    const text = inputText;
    setInputText("");
    const updatedMessages = [...messages];
    updatedMessages.push({ role: "user", content: text });
    setMessages(updatedMessages);
    updatedMessages.push({ role: "assistant", content: "" });
    try {
      setIsLoading(true);
      abortController.current = new AbortController();
      const stream = await sendMsgToOpenAI(
        [...messages, { role: "user", content: text }],
        abortController.current
      );
      for await (const part of stream) {
        updatedMessages[updatedMessages.length - 1].content +=
          part.choices[0]?.delta?.content || "";
        setMessages(updatedMessages);
        setLastResponse((r) => r + (part.choices[0]?.delta?.content || ""));
      }
      setIsLoading(false);
    } catch (err) {
      toast.error(`CalvinAI is down: ${err.message}`, { containerId: "B" });
    }
  };
  return (
    <div className="calvinai-discussion">
      <CalvinAIDiscussionContent
        messages={messages}
        msgEndRef={msgEndRef}
        contentRef={contentRef}
      />
      <div className="calvinai-discussion__stop-btn">
        <button onClick={() => abortController.current.abort()}>
          Stop generating
        </button>
      </div>
      <CalvinAIInput
        handleChangeInput={handleChangeInput}
        value={inputText}
        handleAskGPT={handleAskGPT}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CalvinAIDiscussion;
