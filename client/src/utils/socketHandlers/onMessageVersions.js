export const onMessageVersions = (message, setVersions, clinicalNoteId) => {
  if (message.route !== "VERSIONS") return;
  if (message.content.data[0].clinical_note_id !== clinicalNoteId) return;
  setVersions(message.content.data);
};
