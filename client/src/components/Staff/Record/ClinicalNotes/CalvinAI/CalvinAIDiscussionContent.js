import React from "react";
import CalvinAIMessage from "./CalvinAIMessage";

const CalvinAIDiscussionContent = ({ messages, msgEndRef, contentRef }) => {
  return (
    <div className="calvinai-discussion__content" ref={contentRef}>
      {messages.map((message, i) => (
        <CalvinAIMessage role={message.role} key={i} message={message} />
      ))}
      <div ref={msgEndRef}></div>
    </div>
  );
};
export default CalvinAIDiscussionContent;
