export const getInboxMessagesExternal = (messages, userType, userId) => {
  //Les messages qui sont à destination de l'user et qui ne sont pas deleted
  const messagesToUser = messages.filter(
    (message) => message.to_user_type === userType && message.to_id === userId
  );
  let messagesToUserNonDeleted;

  if (userType === "staff") {
    messagesToUserNonDeleted = messagesToUser.filter(
      (message) => message.deleted_by_staff_id !== userId
    );
  } else {
    messagesToUserNonDeleted = messagesToUser.filter(
      (message) => message.deleted_by_patient_id !== userId
    );
  }
  return messagesToUserNonDeleted;
};

export const getSentMessagesExternal = (messages, userType, userId) => {
  //Les messages envoyés par le user non deleted
  const messagesSentByUser = messages.filter(
    (message) =>
      message.from_user_type === userType && message.from_id === userId
  );

  let messagesSentByUserNonDeleted;
  if (userType === "staff") {
    messagesSentByUserNonDeleted = messagesSentByUser.filter(
      (message) => message.deleted_by_staff_id !== userId
    );
  } else {
    messagesSentByUserNonDeleted = messagesSentByUser.filter(
      (message) => message.deleted_by_patient_id !== userId
    );
  }
  return messagesSentByUserNonDeleted;
};

export const getDeletedMessagesExternal = (messages, userType, userId) => {
  let messagesDeletedByUser;
  if (userType === "staff") {
    messagesDeletedByUser = messages.filter(
      (message) => message.deleted_by_staff_id === userId
    );
  } else {
    messagesDeletedByUser = messages.filter(
      (message) => message.deleted_by_patient_id === userId
    );
  }
  return messagesDeletedByUser;
};

export const filterAndSortExternalMessages = (
  section,
  datas,
  userType,
  userId
) => {
  let newMessages = [];
  switch (section) {
    case "Inbox":
      newMessages = getInboxMessagesExternal(datas, userType, userId);
      break;
    case "Sent messages":
      newMessages = getSentMessagesExternal(datas, userType, userId);
      break;
    case "Deleted messages":
      newMessages = getDeletedMessagesExternal(datas, userType, userId);
      break;
    default:
      break;
  }
  newMessages.sort((a, b) => b.date_created - a.date_created);
  return newMessages;
};
