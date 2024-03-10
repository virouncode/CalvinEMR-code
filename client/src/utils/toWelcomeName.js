import { patientIdToName } from "./patientIdToName";
import { staffIdToTitleAndName } from "./staffIdToTitleAndName";

export const toWelcomeName = (user, staffInfos, demographicsInfos) => {
  if (user.access_level === "Admin") {
    return user.name;
  } else if (user.access_level === "Staff") {
    return staffIdToTitleAndName(staffInfos, user.id);
  } else {
    return patientIdToName(demographicsInfos, user.id);
  }
};
