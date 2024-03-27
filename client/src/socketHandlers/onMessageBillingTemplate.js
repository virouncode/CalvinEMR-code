export const onMessageBillingTemplates = (
  message,
  billingTemplates,
  setBillingTemplates
) => {
  if (message.route !== "BILLING TEMPLATES") return;
  switch (message.action) {
    case "create":
      const newBillingTemplates = [message.content.data, ...billingTemplates];
      setBillingTemplates(
        newBillingTemplates.sort((a, b) => a.name.localeCompare(b.name))
      );
      break;
    case "update":
      const billingTemplatesUpdated = billingTemplates.map((item) =>
        item.id === message.content.id ? message.content.data : item
      );
      setBillingTemplates(
        billingTemplatesUpdated.sort((a, b) => a.name.localeCompare(b.name))
      );
      break;
    case "delete":
      setBillingTemplates(
        billingTemplates.filter((item) => item.id !== message.content.id)
      );
      break;
    default:
      break;
  }
};
