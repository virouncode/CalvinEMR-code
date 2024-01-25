export const onMessageBilling = (
  message,
  billings,
  setBillings,
  userId,
  isSecretary
) => {
  if (message.route !== "BILLING") return;
  if (
    message.action !== "delete" &&
    !isSecretary &&
    message.content.data.provider_id !== userId
  )
    return;
  switch (message.action) {
    case "create":
      setBillings(
        [...billings, message.content.data].sort(
          (a, b) => b.date_created - a.date_created
        )
      );
      break;
    case "update":
      setBillings(
        billings
          .map((billing) =>
            billing.id === message.content.id ? message.content.data : billing
          )
          .sort((a, b) => b.date_created - a.date_created)
      );
      break;
    case "delete":
      setBillings(
        billings
          .filter(({ id }) => id !== message.content.id)
          .sort((a, b) => b.date_created - a.date_created)
      );
      break;
    default:
      break;
  }
};
