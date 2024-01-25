import React from "react";
import MessagesAttachments from "../MessagesAttachments";
import MessageExternal from "./MessageExternal";

const MessagesExternalPrintPU = ({
  message,
  previousMsgs,
  author,
  authorTitle,
  attachments,
}) => {
  const handleClickPrint = (e) => {
    e.nativeEvent.view.print();
  };
  return (
    <div className="messages-print__container">
      <div className="messages-print__section">
        <div className="messages-print__title">
          <p className="messages-print__subject">
            <strong>Subject:{"\u00A0"}</strong>
            {message.subject}
          </p>
        </div>
        <div className="messages-print__content">
          <MessageExternal
            message={message}
            author={author}
            authorTitle={authorTitle}
            key={message.id}
            index={0}
          />
          {previousMsgs &&
            previousMsgs.map((message, index) => (
              <MessageExternal
                message={message}
                key={message.id}
                index={index + 1}
              />
            ))}
          <MessagesAttachments
            attachments={attachments}
            deletable={false}
            cardWidth="20%"
            addable={false}
          />
        </div>
        <div className="messages-print__btn">
          <button onClick={handleClickPrint}>Print</button>
        </div>
      </div>
    </div>
  );
};

export default MessagesExternalPrintPU;
