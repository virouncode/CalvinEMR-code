import { filterAndSortMessages } from "../filterAndSortMessages";

export const onMessagesInbox = (
  message,
  messages,
  setMessages,
  section,
  userId
) => {
  if (message.route !== "MESSAGES INBOX") return;

  switch (message.action) {
    case "create":
      if (
        (message.content.data.staff_id === userId && section === "To-dos") ||
        ((message.content.data.from_id === userId ||
          message.content.data.to_staff_ids.includes(userId)) &&
          section !== "To-dos")
      ) {
        setMessages(
          filterAndSortMessages(
            section,
            [message.content.data, ...messages],
            userId
          )
        );
      }
      break;
    case "update":
      if (
        (message.content.data.staff_id === userId && section === "To-dos") ||
        ((message.content.data.from_id === userId ||
          message.content.data.to_staff_ids.includes(userId)) &&
          section !== "To-dos")
      ) {
        setMessages(
          filterAndSortMessages(
            section,
            messages.map((item) =>
              item.id === message.content.id ? message.content.data : item
            ),
            userId
          )
        );
      }
      break;
    case "delete":
      if (section === "To-dos") {
        setMessages(
          filterAndSortMessages(
            section,
            messages.filter((item) => item.id !== message.content.id),
            userId
          )
        );
      }
      break;
    default:
      break;
  }
};
