export const onMessageClinic = (message, setClinic) => {
  if (message.route !== "CLINIC") return;
  switch (message.action) {
    case "update":
      setClinic(message.content.data);
      localStorage.setItem("clinic", JSON.stringify(message.content.data));
      break;
    default:
      break;
  }
};
