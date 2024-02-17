import React from "react";
import CircularProgressMedium from "../../../All/UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import MessageDetail from "./MessageDetail";
import MessagesOverview from "./MessagesOverview";
import NewMessage from "./NewMessage";

const MessagesBox = ({
  section,
  newVisible,
  setNewVisible,
  setSection,
  msgsSelectedIds,
  setMsgsSelectedIds,
  currentMsgId,
  setCurrentMsgId,
  messages,
  popUpVisible,
  setPopUpVisible,
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
      <div className="messages-content__box">
        {messages ? (
          messages?.length !== 0 ? (
            currentMsgId === 0 ? (
              <MessagesOverview
                messages={messages}
                setCurrentMsgId={setCurrentMsgId}
                msgsSelectedIds={msgsSelectedIds}
                setMsgsSelectedIds={setMsgsSelectedIds}
                section={section}
              />
            ) : (
              <MessageDetail
                setCurrentMsgId={setCurrentMsgId}
                message={messages.find(({ id }) => id === currentMsgId)}
                section={section}
                popUpVisible={popUpVisible}
                setPopUpVisible={setPopUpVisible}
              />
            )
          ) : (
            <p>{emptySectionMessages(section)}</p>
          )
        ) : (
          <CircularProgressMedium />
        )}
      </div>
      {newVisible && (
        <FakeWindow
          title="NEW MESSAGE"
          width={1000}
          height={600}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 600) / 2}
          color={"#94bae8"}
          setPopUpVisible={setNewVisible}
        >
          <NewMessage setNewVisible={setNewVisible} />
        </FakeWindow>
      )}
    </>
  );
};

export default MessagesBox;
