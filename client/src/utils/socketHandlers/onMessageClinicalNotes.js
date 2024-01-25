export const onMessageClinicalNotes = (
  message,
  clinicalNotes,
  setClinicalNotes,
  patientId,
  order
) => {
  if (
    message.route !== "CLINICAL NOTES" ||
    message.content.data.patient_id !== patientId
  )
    return;
  switch (message.action) {
    case "create":
      const newClinicalNotes = [...clinicalNotes, message.content.data];
      order === "top"
        ? setClinicalNotes(
            newClinicalNotes.sort(
              (a, b) =>
                (b.date_updated ? b.date_updated : b.date_created) -
                (a.date_updated ? a.date_updated : a.date_created)
            )
          )
        : setClinicalNotes(
            newClinicalNotes.sort(
              (a, b) =>
                (a.date_updated ? a.date_updated : a.date_created) -
                (b.date_updated ? b.date_updated : b.date_created)
            )
          );
      break;
    case "update":
      const progressNotesUpdated = clinicalNotes.map((progressNote) =>
        progressNote.id === message.content.id
          ? message.content.data
          : progressNote
      );
      order === "top"
        ? setClinicalNotes(
            progressNotesUpdated.sort(
              (a, b) =>
                (b.date_updated ? b.date_updated : b.date_created) -
                (a.date_updated ? a.date_updated : a.date_created)
            )
          )
        : setClinicalNotes(
            progressNotesUpdated.sort(
              (a, b) =>
                (a.date_updated ? a.date_updated : a.date_created) -
                (b.date_updated ? b.date_updated : b.date_created)
            )
          );
      break;
    default:
      break;
  }
};
