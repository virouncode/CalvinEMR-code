export const onMessageAvailability = (
  message,
  setAvailability,
  practicianSelectedId
) => {
  if (message.route !== "AVAILABILITY") return;
  if (message.content.id !== practicianSelectedId) {
    switch (message.action) {
      case "update":
        setAvailability(message.content.data);
        break;
      default:
        break;
    }
  }
};
