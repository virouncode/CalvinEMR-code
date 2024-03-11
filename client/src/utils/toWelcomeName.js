import { adminIdToName } from "./adminIdToName";
import { staffIdToTitleAndName } from "./staffIdToTitleAndName";
import { toPatientName } from "./toPatientName";

export const toWelcomeName = (user, staffInfos, adminsInfos) => {
  console.log("userdemo", user.demographics);
  if (user.access_level === "Admin") {
    return adminIdToName(adminsInfos, user.id, false, true);
  } else if (user.access_level === "Staff") {
    return staffIdToTitleAndName(staffInfos, user.id, false, true);
  } else {
    return toPatientName(user.demographics, true);
  }
};
