import { sortClinicalNotesByDate } from "../utils/dates/updates";

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
      setClinicalNotes(sortClinicalNotesByDate(newClinicalNotes, order));
      break;
    case "update":
      const progressNotesUpdated = clinicalNotes.map((item) =>
        item.id === message.content.id ? message.content.data : item
      );
      setClinicalNotes(sortClinicalNotesByDate(progressNotesUpdated, order));
      break;
    default:
      break;
  }
};
