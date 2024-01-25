export const onMessagePatientRecord = (message, setPatientInfos) => {
  if (message.route !== "DEMOGRAPHICS") return;
  if (message.action === "update") {
    setPatientInfos(message.content.data);
  }
};
