import React from "react";
import EmptyParagraph from "../../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../../All/UI/Tables/LoadingParagraph";
import MessageExternalThumbnail from "./MessageExternalThumbnail";
import MessagesExternalOverviewToolbar from "./MessagesExternalOverviewToolbar";

const MessagesExternalOverview = ({
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
        return `No inbox external messages`;
      case "Sent messages":
        return `No sent external messages`;
      case "Deleted messages":
        return `No deleted external messages`;
      default:
        break;
    }
  };
  return (
    <>
      <MessagesExternalOverviewToolbar section={section} />
      {errMsg && <div className="messages-content__err">{errMsg}</div>}
      {!errMsg &&
        (messages && messages.length > 0
          ? messages.map((item, index) =>
              index === messages.length - 1 ? (
                <MessageExternalThumbnail
                  key={item.id}
                  message={item}
                  setCurrentMsgId={setCurrentMsgId}
                  setMsgsSelectedIds={setMsgsSelectedIds}
                  msgsSelectedIds={msgsSelectedIds}
                  section={section}
                  lastItemRef={lastItemRef}
                />
              ) : (
                <MessageExternalThumbnail
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

export default MessagesExternalOverview;
