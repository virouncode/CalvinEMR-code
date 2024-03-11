import { toLocalDate } from "./formatDates";
import { staffIdToTitleAndName } from "./staffIdToTitleAndName";

export const toExportCSVName = (
  accessLevel,
  userTitle,
  rangeStart,
  rangeEnd,
  all,
  staffInfos,
  staffId
) => {
  const start = all ? "" : `_${toLocalDate(rangeStart)}`;
  const end = all ? "" : `_to_${toLocalDate(rangeEnd)}`;
  const allCaption = all ? "_All" : "";
  let name = "";

  if (accessLevel === "Admin" || userTitle === "Secretary") {
    name = "";
  } else {
    name = `_${staffIdToTitleAndName(staffInfos, staffId, false, false)}`;
  }

  return `Billings${name}${start}${end}${allCaption}.csv`;
};
