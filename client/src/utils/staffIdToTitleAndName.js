import formatName from "./formatName";

export const staffIdToTitleAndName = (staffInfos, staffId, format = false) => {
  if (!staffId) return "";
  if (format) {
    return (
      (staffInfos.find(({ id }) => id === staffId)?.title === "Doctor"
        ? "Dr. "
        : "") +
      formatName(staffInfos.find(({ id }) => id === staffId)?.full_name)
    );
  } else {
    return (
      (staffInfos.find(({ id }) => id === staffId)?.title === "Doctor"
        ? "Dr. "
        : "") + staffInfos.find(({ id }) => id === staffId)?.full_name
    );
  }
};
