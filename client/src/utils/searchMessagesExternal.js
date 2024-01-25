import { patientIdToName } from "./patientIdToName";
import { staffIdToName } from "./staffIdToName";

export const searchMessagesExternal = (messages, search, clinic) => {
  return messages.filter((message) =>
    message.from_user_type === "staff"
      ? //L'envoyeur est un staff
        staffIdToName(clinic.staffInfos, message.from_id)
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        patientIdToName(clinic.demographicsInfos, message.to_id)
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        message.subject.toLowerCase().includes(search.toLowerCase()) ||
        message.body.toLowerCase().includes(search.toLowerCase())
      : //L'envoyeur est un patient
        patientIdToName(clinic.demographicsInfos, message.from_id)
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        staffIdToName(clinic.staffInfos, message.to_id)
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        message.subject.toLowerCase().includes(search.toLowerCase()) ||
        message.body.toLowerCase().includes(search.toLowerCase())
  );
};
