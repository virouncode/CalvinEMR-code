import React from "react";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import MessagePatientThumbnail from "./MessagePatientThumbnail";
import MessagesPatientOverviewToolbar from "./MessagesPatientOverviewToolbar";

const MessagesPatientOverview = ({
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
        return search ? `No results in inbox messages` : `No inbox messages`;
      case "Sent messages":
        return search ? `No results in sent messages` : `No sent messages`;
      case "Deleted messages":
        return search
          ? `No results in deleted messages`
          : `No deleted messages`;
      default:
        break;
    }
  };
  return (
    <>
      <MessagesPatientOverviewToolbar section={section} />
      {errMsg && <div className="messages-content__err">{errMsg}</div>}
      {!errMsg &&
        (messages && messages.length > 0
          ? messages.map((item, index) =>
              index === messages.length - 1 ? (
                <MessagePatientThumbnail
                  key={item.id}
                  message={item}
                  setCurrentMsgId={setCurrentMsgId}
                  setMsgsSelectedIds={setMsgsSelectedIds}
                  msgsSelectedIds={msgsSelectedIds}
                  section={section}
                  lastItemRef={lastItemRef}
                />
              ) : (
                <MessagePatientThumbnail
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

export default MessagesPatientOverview;
