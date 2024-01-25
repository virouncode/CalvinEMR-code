import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { sendMsgToOpenAI } from "../../../api/openapi";
import CalvinAIChatContent from "./CalvinAIChatContent";
import CalvinAIInput from "./CalvinAIInput";

const CalvinAIChat = () => {
  const msgEndRef = useRef(null);
  const contentRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastResponse, setLastResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const abortController = useRef(null);

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
      toast.error(`CalvinAI is down: ${err.message}`, { containerId: "A" });
    }
  };
  return (
    <div className="calvinai-chat">
      <CalvinAIChatContent
        messages={messages}
        msgEndRef={msgEndRef}
        contentRef={contentRef}
      />
      <div className="calvinai-chat__stop-btn">
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
      {/* <textarea
        className="calvinai-chat-textarea"
        onChange={handleChangeInput}
        value={inputText}
        autoFocus
        placeholder="Please write your message here"
      />
      {isLoading ? (
        <TypingDots text="" style={{ bottom: "9.5%", right: "11%" }} />
      ) : (
        <button
          onClick={handleAskGPT}
          className="calvinai-chat-send-btn"
          disabled={isLoading}
        />
      )} */}
    </div>
  );
};

export default CalvinAIChat;
