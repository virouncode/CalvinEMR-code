import { filterAndSortExternalMessages } from "../filterAndSortExternalMessages";

export const onMessagesInboxExternal = (
  message,
  messages,
  setMessages,
  section,
  userId,
  userType
) => {
  if (message.route !== "MESSAGES INBOX EXTERNAL") return;
  //Je suis un staff, suis-je concerné
  if (userType === "staff") {
    if (
      (message.content.data.from_user_type === "staff" &&
        message.content.data.from_id !== userId) ||
      (message.content.data.to_user_type === "staff" &&
        message.content.data.to_id !== userId)
    )
      return;
  }
  //Je suis un patient, suis-concerné
  else if (userType === "patient") {
    if (
      (message.content.data.from_user_type === "patient" &&
        message.content.data.from_id !== userId) ||
      (message.content.data.to_user_type === "patient" &&
        message.content.data.to_id !== userId)
    )
      return;
  }
  switch (message.action) {
    case "create":
      setMessages(
        filterAndSortExternalMessages(
          section,
          [...messages, message.content.data],
          userType,
          userId
        )
      );
      break;
    case "update":
      setMessages(
        filterAndSortExternalMessages(
          section,
          messages.map((item) =>
            item.id === message.content.id ? message.content.data : item
          ),
          userType,
          userId
        )
      );
      break;
    default:
      break;
  }
};
