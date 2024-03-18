import { isDateExceededTZ } from "./formatDates";

export const isMedicationActive = (startDate, duration) => {
  return !isDateExceededTZ(startDate, duration);
};
