import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoPatient } from "../../../api/xanoPatient";
import useAuth from "../../../hooks/useAuth";
import { filterAndSortExternalMessages } from "../../../utils/filterAndSortExternalMessages";
import { searchMessagesExternal } from "../../../utils/searchMessagesExternal";
import { onMessagesInboxExternal } from "../../../utils/socketHandlers/onMessagesInboxExternal";
import MessagesPatientBox from "./MessagesPatientBox";
import MessagesPatientLeftBar from "./MessagesPatientLeftBar";
import MessagesPatientToolBar from "./MessagesPatientToolbar";

const MessagesPatient = () => {
  //HOOKSs
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("Inbox");
  const [newVisible, setNewVisible] = useState(false);
  const [msgsSelectedIds, setMsgsSelectedIds] = useState([]);
  const [currentMsgId, setCurrentMsgId] = useState(0);
  const [messages, setMessages] = useState(null);
  const { auth, user, clinic, socket } = useAuth();
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [selectAllVisible, setSelectAllVisible] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchMessages = async () => {
      try {
        const response = await axiosXanoPatient.get(
          `/messages_external_for_patient?patient_id=${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );

        if (abortController.signal.aborted) return;
        const newMessages = filterAndSortExternalMessages(
          section,
          response.data,
          "patient",
          user.id
        );
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
  }, [auth.authToken, clinic, search, section, user.id]);

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessagesInboxExternal(
        message,
        messages,
        setMessages,
        section,
        user.id,
        "patient"
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [messages, section, socket, user.id]);

  return (
    <div className="messages-container">
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
      />
      <div className="messages-content">
        <MessagesPatientLeftBar
          section={section}
          setSection={setSection}
          setCurrentMsgId={setCurrentMsgId}
          setMsgsSelectedIds={setMsgsSelectedIds}
          setSelectAllVisible={setSelectAllVisible}
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
          popUpVisible={popUpVisible}
          setPopUpVisible={setPopUpVisible}
        />
      </div>
    </div>
  );
};

export default MessagesPatient;
