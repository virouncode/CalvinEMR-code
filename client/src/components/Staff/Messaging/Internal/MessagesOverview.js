import React from "react";
import EmptyParagraph from "../../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../../All/UI/Tables/LoadingParagraph";
import MessageThumbnail from "./MessageThumbnail";
import MessagesOverviewToolbar from "./MessagesOverviewToolbar";

const MessagesOverview = ({
  messages,
  loading,
  errMsg,
  setCurrentMsgId,
  msgsSelectedIds,
  setMsgsSelectedIds,
  section,
  lastItemRef,
}) => {
  const emptySectionMessages = (sectionName) => {
    switch (sectionName) {
      case "Inbox":
        return `No inbox internal messages`;
      case "Sent messages":
        return `No sent internal messages`;
      case "Deleted messages":
        return `No deleted internal messages`;
      default:
        break;
    }
  };

  return (
    <>
      <MessagesOverviewToolbar section={section} />
      {errMsg && <div className="messages-content__err">{errMsg}</div>}
      {!errMsg &&
        (messages && messages.length > 0
          ? messages.map((item, index) =>
              index === messages.length - 1 ? (
                <MessageThumbnail
                  key={item.id}
                  message={item}
                  setCurrentMsgId={setCurrentMsgId}
                  setMsgsSelectedIds={setMsgsSelectedIds}
                  msgsSelectedIds={msgsSelectedIds}
                  section={section}
                  lastItemRef={lastItemRef}
                />
              ) : (
                <MessageThumbnail
                  key={item.id}
                  message={item}
                  setCurrentMsgId={setCurrentMsgId}
                  setMsgsSelectedIds={setMsgsSelectedIds}
                  msgsSelectedIds={msgsSelectedIds}
                  section={section}
                />
              )
            )
          : !loading && (
              <EmptyParagraph text={emptySectionMessages(section)} />
            ))}
      {loading && <LoadingParagraph />}
    </>
  );
};

export default MessagesOverview;
