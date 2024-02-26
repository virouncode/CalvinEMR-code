import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchMessagesExternal from "../../../../hooks/useFetchMessagesExternal";
import useMessagesExternalSocket from "../../../../hooks/useMessagesExternalSocket";
import useUserContext from "../../../../hooks/useUserContext";
import MessagesLeftBar from "../MessagesLeftBar";
import MessagesExternalBox from "./MessagesExternalBox";
import MessagesExternalToolBar from "./MessagesExternalToolbar";

const MessagesExternal = () => {
  //HOOKS
  const { user } = useUserContext();
  const { messageId, sectionName } = useParams();
  console.log(messageId, sectionName);
  const [search, setSearch] = useState("");
  const [section, setSection] = useState(sectionName || "Inbox");
  const [newVisible, setNewVisible] = useState(false);
  const [msgsSelectedIds, setMsgsSelectedIds] = useState([]);
  const [currentMsgId, setCurrentMsgId] = useState(0);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [selectAllVisible, setSelectAllVisible] = useState(true);

  const [paging, setPaging] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });
  const { messages, setMessages, loading, errMsg, hasMore } =
    useFetchMessagesExternal(
      paging,
      search,
      sectionName,
      section,
      user.id,
      "staff"
    );
  const navigate = useNavigate();
  useMessagesExternalSocket(messages, setMessages, section, "staff");

  useEffect(() => {
    if (messageId) {
      setCurrentMsgId(parseInt(messageId));
      navigate("/staff/messages");
    }
  }, [messageId, navigate, setCurrentMsgId]);

  return (
    <div className="messages-container">
      <MessagesExternalToolBar
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
      />
      <div className="messages-content">
        <MessagesLeftBar
          msgType="external"
          section={section}
          setSection={setSection}
          setCurrentMsgId={setCurrentMsgId}
          setMsgsSelectedIds={setMsgsSelectedIds}
          setSelectAllVisible={setSelectAllVisible}
          paging={paging}
          setPaging={setPaging}
          setMessages={setMessages}
        />
        <MessagesExternalBox
          section={section}
          newVisible={newVisible}
          setNewVisible={setNewVisible}
          msgsSelectedIds={msgsSelectedIds}
          setMsgsSelectedIds={setMsgsSelectedIds}
          currentMsgId={currentMsgId}
          setCurrentMsgId={setCurrentMsgId}
          messages={messages}
          loading={loading}
          errMsg={errMsg}
          hasMore={hasMore}
          setPaging={setPaging}
          popUpVisible={popUpVisible}
          setPopUpVisible={setPopUpVisible}
        />
      </div>
    </div>
  );
};

export default MessagesExternal;
