import { toLocalDate } from "./formatDates";

export const createChartNbr = (dob, gender, id) => {
  const dobString = toLocalDate(dob).split("-").join("");
  const genderCode = gender === "Female" ? "0" : gender === "Male" ? "1" : "2";
  let idString = id.toString();
  if (idString.length === 1) {
    idString = "0000" + idString;
  } else if (idString.length === 2) {
    idString = "000" + idString;
  } else if (idString.length === 3) {
    idString = "00" + idString;
  } else if (idString.length === 4) {
    idString = "0" + idString;
  }
  return dobString + genderCode + idString;
};
