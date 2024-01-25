import { filterAndSortMessages } from "../filterAndSortMessages";

export const onMessagesInbox = (
  message,
  messages,
  setMessages,
  section,
  userId
) => {
  if (message.route !== "MESSAGES INBOX") return;
  if (
    message.content.data.from_id !== userId &&
    !message.content.data.to_staff_ids.includes(userId)
  )
    return;
  switch (message.action) {
    case "create":
      setMessages(
        filterAndSortMessages(
          section,
          [...messages, message.content.data],
          userId
        )
      );
      break;
    case "update":
      setMessages(
        filterAndSortMessages(
          section,
          messages.map((item) =>
            item.id === message.content.id ? message.content.data : item
          ),
          userId
        )
      );
      break;
    default:
      break;
  }
};
