export const onMessagePatientDemo = (
  message,
  setDemographicsInfos,
  patientId
) => {
  if (
    message.route !== "DEMOGRAPHICS" ||
    patientId !== message.content.data.patient_id
  )
    return;
  if (message.action === "update") {
    setDemographicsInfos(message.content.data);
  }
};
