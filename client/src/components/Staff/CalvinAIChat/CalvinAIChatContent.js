import React from "react";
import CalvinAIChatMessage from "./CalvinAIChatMessage";

const CalvinAIChatContent = ({ messages, msgEndRef, contentRef }) => {
  return (
    <div className="calvinai-chat__content" ref={contentRef}>
      {messages.map((message, i) => (
        <CalvinAIChatMessage role={message.role} key={i} message={message} />
      ))}
      <div ref={msgEndRef}></div>
    </div>
  );
};
export default CalvinAIChatContent;
