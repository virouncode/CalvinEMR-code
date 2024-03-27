export const staffIdToTitle = (staffInfos, staffId) => {
  if (staffId === 0) return "";
  return staffInfos.find(({ id }) => id === staffId)?.title === "Doctor"
    ? "Dr. "
    : "";
};
