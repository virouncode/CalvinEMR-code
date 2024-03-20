import React from "react";
import useIntersection from "../../../../hooks/useIntersection";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import MessageDetail from "./MessageDetail";
import MessagesOverview from "./MessagesOverview";
import NewMessage from "./NewMessage";
import NewTodo from "./NewTodo";

const MessagesBox = ({
  section,
  newVisible,
  setNewVisible,
  newTodoVisible,
  setNewTodoVisible,
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
            search={search}
          />
        ) : (
          <MessageDetail
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
          <NewMessage setNewVisible={setNewVisible} />
        </FakeWindow>
      )}
      {newTodoVisible && (
        <FakeWindow
          title="NEW TO-DO"
          width={1000}
          height={600}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 600) / 2}
          color={"#94bae8"}
          setPopUpVisible={setNewTodoVisible}
        >
          <NewTodo setNewTodoVisible={setNewTodoVisible} />
        </FakeWindow>
      )}
    </>
  );
};

export default MessagesBox;
