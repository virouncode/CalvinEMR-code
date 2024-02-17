export const onMessageAllPatientsDemo = (
  message,
  patientsDemographics,
  setPatientsDemographics
) => {
  if (message.route !== "DEMOGRAPHICS") return;
  console.log("hello from onMessageAllPatientsDemo ");
  switch (message.action) {
    case "create":
      setPatientsDemographics([message.content.data, ...patientsDemographics]);
      break;
    case "update":
      setPatientsDemographics(
        patientsDemographics.map((item) =>
          item.patient_id === message.content.id ? message.content.data : item
        )
      );
      break;
    default:
      break;
  }
};
