import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUserContext from "../../../../hooks/context/useUserContext";
import useMessagesSocket from "../../../../hooks/socket/useMessagesSocket";
import useFetchMessages from "../../../../hooks/useFetchMessages";
import MessagesLeftBar from "../MessagesLeftBar";
import MessagesBox from "./MessagesBox";
import MessagesToolBar from "./MessagesToolBar";

const Messages = () => {
  //HOOKS
  const { user } = useUserContext();
  const { messageId, sectionName } = useParams();
  const [search, setSearch] = useState("");
  const [section, setSection] = useState(sectionName || "Inbox");
  const [newVisible, setNewVisible] = useState(false);
  const [msgsSelectedIds, setMsgsSelectedIds] = useState([]);
  const [currentMsgId, setCurrentMsgId] = useState(0);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [selectAllVisible, setSelectAllVisible] = useState(true);
  const [newTodoVisible, setNewTodoVisible] = useState(false);

  const [paging, setPaging] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });
  const { messages, setMessages, loading, errMsg, hasMore } = useFetchMessages(
    paging,
    search,
    messageId,
    section,
    user.id
  );

  useMessagesSocket(messages, setMessages, section);

  useEffect(() => {
    if (messageId) {
      setCurrentMsgId(parseInt(messageId));
    }
  }, [messageId]);

  return (
    <div className="messages-container">
      <MessagesToolBar
        search={search}
        setSearch={setSearch}
        newVisible={newVisible}
        setNewVisible={setNewVisible}
        section={section}
        setSection={setSection}
        msgsSelectedIds={msgsSelectedIds}
        setMsgsSelectedIds={setMsgsSelectedIds}
        currentMsgId={currentMsgId}
        messages={messages}
        setPopUpVisible={setPopUpVisible}
        selectAllVisible={selectAllVisible}
        setSelectAllVisible={setSelectAllVisible}
        paging={paging}
        setPaging={setPaging}
        newTodoVisible={newTodoVisible}
        setNewTodoVisible={setNewTodoVisible}
      />
      <div className="messages-content">
        <MessagesLeftBar
          msgType="internal"
          section={section}
          setSection={setSection}
          setCurrentMsgId={setCurrentMsgId}
          setMsgsSelectedIds={setMsgsSelectedIds}
          setSelectAllVisible={setSelectAllVisible}
          paging={paging}
          setPaging={setPaging}
          setMessages={setMessages}
        />
        <MessagesBox
          section={section}
          newVisible={newVisible}
          setNewVisible={setNewVisible}
          newTodoVisible={newTodoVisible}
          setNewTodoVisible={setNewTodoVisible}
          setSection={setSection}
          msgsSelectedIds={msgsSelectedIds}
          setMsgsSelectedIds={setMsgsSelectedIds}
          currentMsgId={currentMsgId}
          setCurrentMsgId={setCurrentMsgId}
          messages={messages}
          setMessages={setMessages}
          loading={loading}
          errMsg={errMsg}
          hasMore={hasMore}
          setPaging={setPaging}
          popUpVisible={popUpVisible}
          setPopUpVisible={setPopUpVisible}
          search={search}
        />
      </div>
    </div>
  );
};

export default Messages;
