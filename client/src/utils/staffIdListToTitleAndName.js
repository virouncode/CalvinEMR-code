import { staffIdToTitleAndName } from "./staffIdToTitleAndName";

export const staffIdListToTitleAndName = (staffInfos, staffIdList) => {
  return staffIdList
    .map((staffId) => staffIdToTitleAndName(staffInfos, staffId))
    .join(", ");
};

export const patientIdListToName = (patientsInfos, patientIdList) => {
  return patientIdList
    .map(
      (patientId) => patientsInfos.find(({ id }) => id === patientId).full_name
    )
    .join(", ");
};
