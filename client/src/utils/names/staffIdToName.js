export const staffIdToName = (staffInfos, staffId, formatted = true) => {
  if (!staffId) return "";
  const firstName =
    staffInfos.find(({ id }) => id === staffId)?.first_name || "";
  const lastName = staffInfos.find(({ id }) => id === staffId)?.last_name || "";
  const middleName = staffInfos.find(({ id }) => id === staffId)?.middle_name
    ? ` ${staffInfos.find(({ id }) => id === staffId)?.middle_name}`
    : "";
  return formatted
    ? lastName + ", " + firstName + middleName
    : firstName + middleName + " " + lastName;
};

export const staffIdToFirstName = (staffInfos, staffId) => {
  if (!staffId) return "";
  return staffInfos.find(({ id }) => id === staffId)?.first_name || "";
};

export const staffIdToLastName = (staffInfos, staffId) => {
  if (!staffId) return "";
  return staffInfos.find(({ id }) => id === staffId)?.last_name || "";
};

export const staffIdToOHIP = (staffInfos, staffId) => {
  if (!staffId) return "";
  return staffInfos.find(({ id }) => id === staffId)?.ohip_billing_nbr || "";
};
