import React from "react";
import useIntersection from "../../../../hooks/useIntersection";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessageExternalDetail from "./MessageExternalDetail";
import MessagesExternalOverview from "./MessagesExternalOverview";
import NewMessageExternal from "./NewMessageExternal";

const MessagesExternalBox = ({
  section,
  newVisible,
  setNewVisible,
  msgsSelectedIds,
  setMsgsSelectedIds,
  currentMsgId,
  setCurrentMsgId,
  messages,
  setMessages,
  loading,
  errMsg,
  hasMore,
  setPaging,
  popUpVisible,
  setPopUpVisible,
  search,
}) => {
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  return (
    <>
      <div className="messages-content__box" ref={rootRef}>
        {currentMsgId === 0 ? (
          <MessagesExternalOverview
            messages={messages}
            loading={loading}
            errMsg={errMsg}
            setCurrentMsgId={setCurrentMsgId}
            msgsSelectedIds={msgsSelectedIds}
            setMsgsSelectedIds={setMsgsSelectedIds}
            section={section}
            lastItemRef={lastItemRef}
            search={search}
          />
        ) : (
          <MessageExternalDetail
            setCurrentMsgId={setCurrentMsgId}
            message={messages.find(({ id }) => id === currentMsgId)}
            section={section}
            popUpVisible={popUpVisible}
            setPopUpVisible={setPopUpVisible}
            setMessages={setMessages}
            setPaging={setPaging}
          />
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
          <NewMessageExternal setNewVisible={setNewVisible} />
        </FakeWindow>
      )}
    </>
  );
};

export default MessagesExternalBox;
