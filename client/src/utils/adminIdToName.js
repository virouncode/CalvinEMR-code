import formatName from "./formatName";

export const adminIdToName = (adminsInfos, adminId, format = false) => {
  if (!adminId) return "";
  if (format) {
    return formatName(adminsInfos.find(({ id }) => id === adminId)?.full_name);
  } else {
    return adminsInfos.find(({ id }) => id === adminId)?.full_name;
  }
};
