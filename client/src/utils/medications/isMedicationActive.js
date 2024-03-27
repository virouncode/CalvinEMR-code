import { isDateExceededTZ } from "../dates/formatDates";

export const isMedicationActive = (startDate, duration) => {
  return !isDateExceededTZ(startDate, duration);
};
