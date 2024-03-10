export const onMessageUnread = (
  message,
  user,
  setUser,
  userAccessLevel,
  userId
) => {
  if (message.route !== "UNREAD") return;
  if (userAccessLevel === user.access_level && message.content.id === userId) {
    switch (message.action) {
      case "update":
        setUser({
          ...user,
          unreadMessagesNbr: user.unreadMessagesNbr + 1,
          unreadNbr: user.unreadNbr + 1,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            unreadMessagesNbr: user.unreadMessagesNbr + 1,
            unreadNbr: user.unreadNbr + 1,
          })
        );
        break;
      default:
        break;
    }
  }
};
