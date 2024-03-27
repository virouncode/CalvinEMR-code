export const onMessageMedTemplate = (
  message,
  medsTemplates,
  setMedsTemplates,
  userId
) => {
  if (message.route !== "MEDS TEMPLATES") return;

  switch (message.action) {
    case "create":
      if (message.content.data.staff_id !== userId) return;
      setMedsTemplates(
        [...medsTemplates, message.content.data].sort((a, b) =>
          a.DrugName.localeCompare(b.DrugName)
        )
      );
      break;
    case "update":
      if (message.content.data.staff_id !== userId) return;
      setMedsTemplates(
        medsTemplates
          .map((template) =>
            template.id === message.content.id ? message.content.data : template
          )
          .sort((a, b) => a.DrugName.localeCompare(b.DrugName))
      );
      break;
    case "delete":
      setMedsTemplates(
        medsTemplates
          .filter((template) => template.id !== message.content.id)
          .sort((a, b) => a.DrugName.localeCompare(b.DrugName))
      );
      break;
    default:
      break;
  }
};
