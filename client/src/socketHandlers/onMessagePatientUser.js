export const onMessagePatientUserDemographics = (
  message,
  user,
  setUser,
  userId
) => {
  if (message.route !== "PATIENT USER DEMOGRAPHICS") return;
  switch (message.action) {
    case "update":
      if (message.content.id === userId) {
        setUser({ ...user, demographics: message.content.data });
      }
      break;
    default:
      break;
  }
};
