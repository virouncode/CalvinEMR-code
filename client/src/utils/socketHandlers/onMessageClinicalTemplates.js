export const onMessageClinicalTemplates = (
  message,
  clinicalTemplates,
  setClinicalTemplates
) => {
  if (message.route !== "CLINICAL TEMPLATES") return;
  switch (message.action) {
    case "create":
      const newClinicalTemplates = [message.content.data, ...clinicalTemplates];
      setClinicalTemplates(
        newClinicalTemplates.sort((a, b) => a.name.localeCompare(b.name))
      );
      break;
    case "update":
      const clinicalTemplatesUpdated = clinicalTemplates.map((item) =>
        item.id === message.content.id ? message.content.data : item
      );
      setClinicalTemplates(
        clinicalTemplatesUpdated.sort((a, b) => a.name.localeCompare(b.name))
      );
      break;
    case "delete":
      setClinicalTemplates(
        clinicalTemplates.filter((item) => item.id !== message.content.id)
      );
      break;
    default:
      break;
  }
};
