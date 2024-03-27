import { timestampToDateISOTZ } from "../dates/formatDates";

export const createChartNbr = (dob, gender, id) => {
  const dobString = timestampToDateISOTZ(dob).split("-").join("").substring(2);
  const genderCode = gender === "Female" ? "0" : gender === "Male" ? "1" : "2";
  let idString = id.toString();
  if (idString.length === 1) {
    idString = "000" + idString;
  } else if (idString.length === 2) {
    idString = "00" + idString;
  } else if (idString.length === 3) {
    idString = "0" + idString;
  }
  return dobString + "-" + genderCode + "-" + idString;
};
