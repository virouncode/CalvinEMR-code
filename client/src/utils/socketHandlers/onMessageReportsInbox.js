export const onMessageReportsInbox = (
  message,
  reports,
  setReports,
  userId,
  isSecretary
) => {
  if (message.route !== "REPORTS INBOX") return;
  switch (message.action) {
    case "create":
      setReports(
        [message.content.data, ...reports].filter(
          ({ assigned_staff_id }) => assigned_staff_id === userId
        )
      );
      break;
    case "update":
      if (reports.find(({ id }) => id === message.content.id)) {
        setReports(
          reports
            .map((item) =>
              item.id === message.content.id ? message.content.data : item
            )
            .filter(({ assigned_staff_id }) => assigned_staff_id === userId)
            .filter(({ acknowledged }) => !acknowledged)
        );
      } else {
        setReports(
          [message.content.data, ...reports]
            .filter(({ assigned_staff_id }) => assigned_staff_id === userId)
            .filter(({ acknowledged }) => !acknowledged)
        );
        break;
      }
      break;
    case "delete":
      setReports(
        reports
          .filter((item) => item.id !== message.content.id)
          .filter(({ assigned_staff_id }) => assigned_staff_id === userId)
          .filter(({ acknowledged }) => !acknowledged)
      );
      break;

    default:
      break;
  }
};
