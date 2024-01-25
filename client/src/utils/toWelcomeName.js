import { patientIdToName } from "./patientIdToName";
import { staffIdToTitleAndName } from "./staffIdToTitleAndName";

export const toWelcomeName = (user, staffInfos, demographicsInfos) => {
  if (user.access_level === "Admin") {
    return user.full_name;
  } else if (user.access_level === "User") {
    return staffIdToTitleAndName(staffInfos, user.id);
  } else {
    return patientIdToName(demographicsInfos, user.id);
  }
};
