import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuth from "../../../../hooks/useAuth";
import { filterAndSortExternalMessages } from "../../../../utils/filterAndSortExternalMessages";
import { searchMessagesExternal } from "../../../../utils/searchMessagesExternal";
import { onMessagesInboxExternal } from "../../../../utils/socketHandlers/onMessagesInboxExternal";
import MessagesLeftBar from "../MessagesLeftBar";
import MessagesExternalBox from "./MessagesExternalBox";
import MessagesExternalToolBar from "./MessagesExternalToolbar";

const MessagesExternal = () => {
  //HOOKSs
  const { messageId, sectionName } = useParams();
  const [search, setSearch] = useState("");
  const [section, setSection] = useState(sectionName || "Inbox");
  const [newVisible, setNewVisible] = useState(false);
  const [msgsSelectedIds, setMsgsSelectedIds] = useState([]);
  const [currentMsgId, setCurrentMsgId] = useState(0);
  const [messages, setMessages] = useState(null);
  const { auth, user, clinic, socket } = useAuth();
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [selectAllVisible, setSelectAllVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (messageId) {
      setCurrentMsgId(parseInt(messageId));
      navigate("/staff/messages");
    }
  }, [messageId, navigate, setCurrentMsgId]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchMessages = async () => {
      try {
        const response = await axiosXanoStaff.get(
          `/messages_external_for_staff?staff_id=${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );

        if (abortController.signal.aborted) return;

        //En fonction de la section on filtre les messages
        let newMessages = filterAndSortExternalMessages(
          sectionName || section,
          response.data,
          "staff",
          user.id
        );

        //Search
        setMessages(searchMessagesExternal(newMessages, search, clinic));
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to get messages: ${err.message}`, {
            containerId: "A",
          });
      }
    };
    fetchMessages();
    return () => {
      abortController.abort();
      setMessages(null);
    };
  }, [auth.authToken, clinic, search, section, sectionName, user.id]);

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessagesInboxExternal(
        message,
        messages,
        setMessages,
        section,
        user.id,
        "staff"
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [messages, section, socket, user.id]);

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
      />
      <div className="messages-content">
        <MessagesLeftBar
          msgType="external"
          section={section}
          setSection={setSection}
          setCurrentMsgId={setCurrentMsgId}
          setMsgsSelectedIds={setMsgsSelectedIds}
          setSelectAllVisible={setSelectAllVisible}
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
          popUpVisible={popUpVisible}
          setPopUpVisible={setPopUpVisible}
        />
      </div>
    </div>
  );
};

export default MessagesExternal;
