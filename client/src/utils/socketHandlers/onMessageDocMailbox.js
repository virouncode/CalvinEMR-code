export const onMessageDocMailbox = (
  message,
  documents,
  setDocuments,
  userId,
  isSecretary
) => {
  if (message.route !== "DOCMAILBOX") return;
  switch (message.action) {
    case "create":
      setDocuments(
        [...documents, message.content.data]
          .filter(({ assigned_staff_id }) => assigned_staff_id === userId)
          .filter(({ acknowledged }) => !acknowledged)
      );
      break;
    case "update":
      if (documents.find(({ id }) => id === message.content.id)) {
        setDocuments(
          documents
            .map((document) =>
              document.id === message.content.id
                ? message.content.data
                : document
            )
            .filter(({ assigned_staff_id }) => assigned_staff_id === userId)
            .filter(({ acknowledged }) => !acknowledged)
        );
      } else {
        setDocuments(
          [...documents, message.content.data]
            .filter(({ assigned_staff_id }) => assigned_staff_id === userId)
            .filter(({ acknowledged }) => !acknowledged)
        );
        break;
      }
      break;
    case "delete":
      setDocuments(
        documents
          .filter((document) => document.id !== message.content.id)
          .filter(({ assigned_staff_id }) => assigned_staff_id === userId)
          .filter(({ acknowledged }) => !acknowledged)
      );
      break;

    default:
      break;
  }
};
