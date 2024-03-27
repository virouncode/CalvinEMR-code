export const onMessageUser = (
  message,
  user,
  setUser,
  userAccessLevel,
  userId
) => {
  if (message.route !== "USER") return;
  if (userAccessLevel === user.access_level && message.content.id === userId) {
    switch (message.action) {
      case "update":
        setUser(message.content.data);
        localStorage.setItem("user", JSON.stringify(message.content.data));
        break;
      default:
        break;
    }
  }
};
