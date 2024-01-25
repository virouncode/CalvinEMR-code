export const onMessageUnread = (message, user, setUser) => {
  if (message.route !== "UNREAD" || message.userId !== user.id) return;

  if (message.userType === "staff") {
    if (message.type === "external") {
      setUser({
        ...user,
        unreadMessagesExternalNbr: message.content.unreadMessagesExternalNbr,
        unreadNbr: message.content.data.unreadNbr,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          unreadMessagesExternalNbr: message.content.unreadMessagesExternalNbr,
          unreadNbr: message.content.data.unreadNbr,
        })
      );
    } else if (message.type === "internal") {
      setUser({
        ...user,
        unreadMessagesNbr: message.content.unreadMessagesNbr,
        unreadNbr: message.content.data.unreadNbr,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          unreadMessagesNbr: message.content.unreadMessagesNbr,
          unreadNbr: message.content.data.unreadNbr,
        })
      );
    }
  } else {
    setUser({
      ...user,
      unreadNbr: message.content.data.unreadNbr,
    });
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        unreadNbr: message.content.data.unreadNbr,
      })
    );
  }
};
