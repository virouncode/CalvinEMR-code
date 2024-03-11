import { staffIdToName } from "./staffIdToName";

export const patientIdToAssignedStaffName = (
  demographicsInfos,
  staffInfos,
  patientId
) => {
  if (!patientId) return "";
  return staffIdToName(staffInfos, demographicsInfos.assigned_staff_id);
};
