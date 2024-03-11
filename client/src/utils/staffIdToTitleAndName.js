import abreviateName from "./abreviateName";
import { staffIdToName } from "./staffIdToName";

export const staffIdToTitleAndName = (
  staffInfos,
  staffId,
  abreviatted = true,
  formatted = true
) => {
  if (!staffId) return "";
  if (abreviatted) {
    return (
      (staffInfos.find(({ id }) => id === staffId)?.title === "Doctor"
        ? "Dr. "
        : staffInfos.find(({ id }) => id === staffId)?.gender === "Male"
        ? "Mr. "
        : staffInfos.find(({ id }) => id === staffId)?.gender === "Female"
        ? "Mrs. "
        : "") +
      abreviateName(
        staffInfos.find(({ id }) => id === staffId)?.full_name,
        formatted
      )
    );
  } else {
    return (
      (staffInfos.find(({ id }) => id === staffId)?.title === "Doctor"
        ? "Dr. "
        : staffInfos.find(({ id }) => id === staffId)?.gender === "Male"
        ? "Mr. "
        : staffInfos.find(({ id }) => id === staffId)?.gender === "Female"
        ? "Mrs. "
        : "") + staffIdToName(staffInfos, staffId, formatted)
    );
  }
};
