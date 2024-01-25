export const staffIdToName = (staffInfos, staffId) => {
  if (!staffId) return "";
  return staffInfos.find(({ id }) => id === staffId)?.full_name || "";
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
