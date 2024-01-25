import formatName from "./formatName";

export const staffIdListToTitleAndName = (staffInfos, staffIdList) => {
  return staffIdList
    .map(
      (staffId) =>
        (staffInfos.find(({ id }) => id === staffId).title === "Doctor"
          ? "Dr. "
          : "") +
        formatName(staffInfos.find(({ id }) => id === staffId).full_name)
    )
    .join(", ");
};

export const patientIdListToName = (patientsInfos, patientIdList) => {
  return patientIdList
    .map(
      (patientId) => patientsInfos.find(({ id }) => id === patientId).full_name
    )
    .join(", ");
};
