import React, { useState } from "react";
import useFetchMessagesPatient from "../../../hooks/useFetchMessagesPatient";
import useMessagesExternalSocket from "../../../hooks/useMessagesExternalSocket";
import useUserContext from "../../../hooks/useUserContext";
import MessagesPatientBox from "./MessagesPatientBox";
import MessagesPatientLeftBar from "./MessagesPatientLeftBar";
import MessagesPatientToolBar from "./MessagesPatientToolbar";

const MessagesPatient = () => {
  //HOOKS
  const { user } = useUserContext();
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("Inbox");
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
    useFetchMessagesPatient(paging, search, section, user.id, "patient");

  useMessagesExternalSocket(messages, setMessages, section, "patient");
  return (
    <div className="messages-container messages-container--patient">
      <MessagesPatientToolBar
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
        <MessagesPatientLeftBar
          section={section}
          setSection={setSection}
          setCurrentMsgId={setCurrentMsgId}
          setMsgsSelectedIds={setMsgsSelectedIds}
          setSelectAllVisible={setSelectAllVisible}
          paging={paging}
          setPaging={setPaging}
          setMessages={setMessages}
        />
        <MessagesPatientBox
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
          search={search}
        />
      </div>
    </div>
  );
};

export default MessagesPatient;
