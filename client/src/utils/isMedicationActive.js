import { add, isAfter } from "date-fns";

export const isMedicationActive = (startDate, duration) => {
  const dateFin = add(new Date(startDate), {
    years: duration.Y,
    months: duration.M,
    weeks: duration.W,
    days: duration.D,
  });
  return isAfter(dateFin, new Date());
};
