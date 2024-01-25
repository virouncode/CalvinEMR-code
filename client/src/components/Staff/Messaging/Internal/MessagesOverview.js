import React from "react";
import MessageThumbnail from "./MessageThumbnail";
import MessagesOverviewToolbar from "./MessagesOverviewToolbar";

const MessagesOverview = ({
  messages,
  setCurrentMsgId,
  msgsSelectedIds,
  setMsgsSelectedIds,
  section,
}) => {
  return (
    <>
      <MessagesOverviewToolbar section={section} />
      {messages.map((message) => (
        <MessageThumbnail
          key={message.id}
          message={message}
          setCurrentMsgId={setCurrentMsgId}
          setMsgsSelectedIds={setMsgsSelectedIds}
          msgsSelectedIds={msgsSelectedIds}
          section={section}
        />
      ))}
    </>
  );
};

export default MessagesOverview;
