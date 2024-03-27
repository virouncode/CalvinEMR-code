import React from "react";
import useUserContext from "../../../hooks/context/useUserContext";

const MessagesLeftBar = ({
  msgType,
  section,
  setSection,
  setCurrentMsgId,
  setMsgsSelectedIds,
  setSelectAllVisible,
  paging,
  setPaging,
  setMessages,
}) => {
  const { user } = useUserContext();

  const handleClickSection = (e) => {
    const name = e.target.id;
    setSection(name);
    setCurrentMsgId(0);
    setMsgsSelectedIds([]);
    setSelectAllVisible(true);
    setMessages([]);
    setPaging({ ...paging, page: 1 });
  };
  const isActive = (id) =>
    section === id
      ? "messages-content__category messages-content__category--active"
      : "messages-content__category";

  return (
    <div className="messages-content__leftbar">
      <ul>
        <li
          className={isActive("Inbox")}
          id="Inbox"
          onClick={handleClickSection}
        >
          {msgType === "internal"
            ? "Inbox" +
              (user.unreadMessagesNbr ? ` (${user.unreadMessagesNbr})` : "")
            : "Inbox" +
              (user.unreadMessagesExternalNbr
                ? ` (${user.unreadMessagesExternalNbr})`
                : "")}
        </li>
        <li
          className={isActive("Sent messages")}
          id="Sent messages"
          onClick={handleClickSection}
        >
          Sent messages
        </li>
        <li
          className={isActive("Deleted messages")}
          id="Deleted messages"
          onClick={handleClickSection}
        >
          Deleted messages
        </li>
        {user.access_level === "Staff" && msgType === "internal" && (
          <li
            className={isActive("To-dos")}
            id="To-dos"
            onClick={handleClickSection}
          >
            To-dos
          </li>
        )}
      </ul>
    </div>
  );
};

export default MessagesLeftBar;
