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
  search,
}) => {
  const emptySectionMessages = (sectionName) => {
    switch (sectionName) {
      case "Inbox":
        return search
          ? `No results in inbox internal messages`
          : `No inbox internal messages`;
      case "Sent messages":
        return search
          ? `No results in sent internal messages`
          : `No sent internal messages`;
      case "Deleted messages":
        return search
          ? `No results in deleted internal messages`
          : `No deleted internal messages`;
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
