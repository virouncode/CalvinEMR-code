import { patientIdToName } from "./patientIdToName";
import { staffIdToName } from "./staffIdToName";

export const searchMessages = (messages, search, clinic) => {
  return messages.filter(
    (message) =>
      staffIdToName(clinic.staffInfos, message.from_id)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      message.to_staff_ids
        .map((id) => staffIdToName(clinic.staffInfos, id))
        .join(", ")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      message.subject.toLowerCase().includes(search.toLowerCase()) ||
      message.body.toLowerCase().includes(search.toLowerCase()) ||
      patientIdToName(clinic.demographicsInfos, message.related_patient_id)
        .toLowerCase()
        .includes(search.toLowerCase())
  );
};
