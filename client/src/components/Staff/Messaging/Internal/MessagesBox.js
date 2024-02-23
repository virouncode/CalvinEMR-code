import React from "react";
import useIntersection from "../../../../hooks/useIntersection";
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
  loading,
  errMsg,
  hasMore,
  setPaging,
  popUpVisible,
  setPopUpVisible,
}) => {
  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  return (
    <>
      <div className="messages-content__box" ref={rootRef}>
        {currentMsgId === 0 ? (
          <MessagesOverview
            messages={messages}
            loading={loading}
            errMsg={errMsg}
            setCurrentMsgId={setCurrentMsgId}
            msgsSelectedIds={msgsSelectedIds}
            setMsgsSelectedIds={setMsgsSelectedIds}
            section={section}
            lastItemRef={lastItemRef}
          />
        ) : (
          <MessageDetail
            setCurrentMsgId={setCurrentMsgId}
            message={messages.find(({ id }) => id === currentMsgId)}
            loading={loading}
            errMsg={errMsg}
            section={section}
            popUpVisible={popUpVisible}
            setPopUpVisible={setPopUpVisible}
            lastItemRef={lastItemRef}
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
          <NewMessage setNewVisible={setNewVisible} />
        </FakeWindow>
      )}
    </>
  );
};

export default MessagesBox;
