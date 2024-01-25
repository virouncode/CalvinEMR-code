export const onMessageSearchPatients = (
  message,
  sortedPatientsInfos,
  setSortedPatientsInfos
) => {
  if (message.route !== "DEMOGRAPHICS") return;
  switch (message.action) {
    case "create":
      setSortedPatientsInfos([...sortedPatientsInfos, message.content.data]);
      break;
    case "update":
      setSortedPatientsInfos(
        sortedPatientsInfos.map((patient) =>
          patient.patient_id === message.content.id
            ? message.content.data
            : patient
        )
      );
      break;
    default:
      break;
  }
};
