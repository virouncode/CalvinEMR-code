import React from "react";
import CalvinAIClinicalMessage from "./CalvinAIClinicalMessage";

const CalvinAIClinicalDiscussionContent = ({
  messages,
  msgEndRef,
  contentRef,
}) => {
  return (
    <div className="calvinai-discussion__content" ref={contentRef}>
      {messages.map((message, i) => (
        <CalvinAIClinicalMessage
          role={message.role}
          key={i}
          message={message}
        />
      ))}
      <div ref={msgEndRef}></div>
    </div>
  );
};
export default CalvinAIClinicalDiscussionContent;
