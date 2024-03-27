import { DateTime, Duration } from "luxon";
//DATE Date object
//ISO "1984-04-25T23:54:23+UTCOffset"
//STR "1984-04-25, 11:54:23 PM"
//HUMAN "Thursday, Apr 10, 11:54 PM"
//TIMESTAMPS

//DATE
export const nowTZ = (timezone = "America/Toronto") => {
  return DateTime.local({ zone: timezone });
};

//ISO
export const timestampToDateISOTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toISODate();
};
export const timestampToTimeISOTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toISOTime();
};
export const timestampToDateTimeSecondsISOTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toISO();
};
export const timestampToDateMonthsLaterISOTZ = (
  timestamp,
  monthsLater,
  timezone = "America/Toronto"
) => {
  return timestampToDateISOTZ(
    timestampMonthsLaterTZ(timestamp, monthsLater, timezone)
  );
};

export const timestampToDateYearsLaterISOTZ = (
  timestamp,
  yearsLater,
  timezone = "America/Toronto"
) => {
  return timestampToDateISOTZ(
    timestampYearsLaterTZ(timestamp, yearsLater, timezone)
  );
};

//STR
export const timestampToHoursStrTZ = (
  timestamp,
  timezone,
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  const hoursStr = DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  })
    .toISOTime({ suppressSeconds: true })
    .substring(0, 2);
  let hours = parseInt(hoursStr) % 12;
  if (hours === 0) hours = 12;
  return hours.toString().padStart(2, "0");
};
export const timestampToMinutesStrTZ = (
  timestamp,
  timezone,
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  })
    .toISOTime({ suppressSeconds: true })
    .substring(3, 5);
};
export const timestampToAMPMStrTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  const hoursStr = DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  })
    .toISOTime({ suppressSeconds: true })
    .substring(0, 2);
  let hours = parseInt(hoursStr);
  return hours >= 12 ? "PM" : "AM";
};

export const timestampToTimeStrTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!timestamp) return "";
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString(DateTime.TIME_SIMPLE);
};
export const timestampToDateTimeStrTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString(DateTime.DATETIME_SHORT);
};
export const timestampToDateTimeSecondsStrTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
};

//HUMAN
export const timestampToHumanDateTimeTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString({
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const timestampToHumanDateTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString({
    weekday: "short",
    month: "short",
    day: "2-digit",
  });
};

export const timestampToHumanTimeTZ = (
  timestamp,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  return DateTime.fromMillis(timestamp, {
    zone: timezone,
    locale,
  }).toLocaleString({
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const nowHumanTZ = (timezone = "America/Toronto", locale = "en-CA") => {
  const currentDateTime = DateTime.local({ zone: timezone });
  // Formater la date et l'heure dans le format désiré avec le fuseau horaire inclus
  const formattedDateTime = currentDateTime.toLocaleString({
    locale,
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
  return formattedDateTime;
};

//TIMESTAMP
export const timestampMonthsLaterTZ = (
  timestamp,
  monthsLater,
  timezone = "America/Toronto"
) => {
  return DateTime.fromMillis(timestamp, { zone: timezone })
    .plus({ months: monthsLater })
    .toMillis();
};
export const timestampYearsLaterTZ = (
  timestamp,
  yearsLater,
  timezone = "America/Toronto"
) => {
  return DateTime.fromMillis(timestamp, { zone: timezone })
    .plus({ years: yearsLater })
    .toMillis();
};

export const dateISOToTimestampTZ = (dateISO, timezone = "America/Toronto") => {
  if (!dateISO) return null;
  return DateTime.fromISO(dateISO, { zone: timezone }).toMillis();
};

export const nowTZTimestamp = (timezone = "America/Toronto") => {
  return nowTZ(timezone).toMillis();
};

export const tzComponentsToTimestamp = (
  dateStr,
  hoursStr,
  minutesStr,
  ampm,
  timezone = "America/Toronto",
  locale = "en-CA"
) => {
  if (!dateStr) return null;
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  let hour = parseInt(hoursStr, 10);
  hour = AMPMto24(hour, ampm);
  return DateTime.fromObject(
    {
      year: parseInt(yearStr, 10),
      month: parseInt(monthStr, 10),
      day: parseInt(dayStr, 10),
      hour,
      minute: parseInt(minutesStr),
    },
    {
      zone: timezone,
      locale,
    }
  ).toMillis();
};

export const getStartOfTheMonthTZ = (timezone = "America/Toronto") => {
  const now = nowTZ();
  const startOfMonth = now.startOf("month");
  const startOfMonthMidnight = startOfMonth.startOf("day");
  return startOfMonthMidnight.toMillis();
};
export const getEndOfTheMonthTZ = (timezone = "America/Toronto") => {
  const now = nowTZ();
  const endOfMonth = now.endOf("month");
  return endOfMonth.toMillis();
};
export const getTodayStartTZ = (timezone = "America/Toronto") => {
  return nowTZ().startOf("day").toMillis();
};
export const getTodayEndTZ = (timezone = "America/Toronto") => {
  return nowTZ().endOf("day").toMillis();
};

//OTHER FUNCTIONS
export const getAgeTZ = (dateOfBirthMs, timezone = "America/Toronto") => {
  if (!dateOfBirthMs) return "";
  const dateOfBirth = DateTime.fromMillis(dateOfBirthMs, {
    zone: "America/Toronto",
  });
  const today = DateTime.local({ zone: "America/Toronto" });
  const age = today.diff(dateOfBirth, "years").years;
  return Math.floor(age);
};

export const isDateExceededTZ = (
  startMillis,
  duration,
  timezone = "America/Toronto"
) => {
  const startDate = DateTime.fromMillis(startMillis, { zone: timezone });
  const currentDate = DateTime.local({ zone: "America/Toronto" });
  const endDate = startDate.plus(
    Duration.fromObject({
      years: duration.Y,
      months: duration.M,
      weeks: duration.W,
      days: duration.D,
    })
  );
  return currentDate > endDate;
};

export const AMPMto24 = (hour, ampm) => {
  if (ampm === "AM") {
    if (hour === 12) return 0;
    else return hour;
  }
  if (ampm === "PM") {
    if (hour === 12) return hour;
    else return hour + 12;
  }
};

export const getWeekRange = (
  firstDayOfTheWeek,
  timezone = "America/Toronto"
) => {
  const today = DateTime.local({ zone: timezone });
  let startOfWeek = today
    .startOf("week")
    .plus({ days: firstDayOfTheWeek - today.weekday });
  if (startOfWeek < today) {
    startOfWeek = startOfWeek.plus({ weeks: 1 });
  }
  const endOfWeek = startOfWeek.plus({ weeks: 1 });

  return [startOfWeek.toMillis(), endOfWeek.toMillis()];
};

export const getLimitTimestampForAge = (age) => {
  const today = DateTime.local({ zone: "America/Toronto" });
  const birthDate = today.minus({ years: age });
  return birthDate.toMillis();
};
