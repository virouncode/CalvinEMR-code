import { timestampToDateISOTZ } from "../dates/formatDates";
import { staffIdToTitleAndName } from "../names/staffIdToTitleAndName";

export const toExportCSVName = (
  accessLevel,
  userTitle,
  rangeStart,
  rangeEnd,
  all,
  staffInfos,
  staffId
) => {
  const start = all ? "" : `_${timestampToDateISOTZ(rangeStart)}`;
  const end = all ? "" : `_to_${timestampToDateISOTZ(rangeEnd)}`;
  const allCaption = all ? "_All" : "";
  let name = "";

  if (accessLevel === "Admin" || userTitle === "Secretary") {
    name = "";
  } else {
    name = `_${staffIdToTitleAndName(staffInfos, staffId, false, false)}`;
  }

  return `Billings${name}${start}${end}${allCaption}.csv`;
};
