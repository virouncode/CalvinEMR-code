export const getInboxMessages = (messages, userId) => {
  return messages.filter(
    (message) =>
      message.to_staff_ids.includes(userId) &&
      !message.deleted_by_staff_ids?.includes(userId)
  );
};

export const getSentMessages = (messages, userId) => {
  return messages.filter(
    (message) =>
      message.from_id === userId &&
      !message.deleted_by_staff_ids?.includes(userId)
  );
};

export const getDeletedMessages = (messages, userId) => {
  return messages.filter((message) =>
    message.deleted_by_staff_ids?.includes(userId)
  );
};

export const filterAndSortMessages = (section, datas, userId) => {
  let newMessages = [];
  switch (section) {
    case "Inbox":
      newMessages = getInboxMessages(datas, userId);
      break;
    case "Sent messages":
      newMessages = getSentMessages(datas, userId);
      break;
    case "Deleted messages":
      newMessages = getDeletedMessages(datas, userId);
      break;
    default:
      break;
  }
  newMessages.sort((a, b) => b.date_created - a.date_created);
  return newMessages;
};
