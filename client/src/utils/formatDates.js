export const toISOStringNoMs = (date) => {
  //date object => 2023-04-15T13:23:15Z  (UTC 0)
  return date.toISOString().slice(0, -5) + "Z";
};

export const toLocalDate = (timestamp) => {
  //2022-03-14T14:40:00Z  =>  2022-03-14 (UTC + local offset) formatted for datetime-local input
  if (!timestamp || isNaN(timestamp)) return "";
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const newDate = date.toISOString().slice(0, 10);
  return newDate;
};

export const toLocalDateAndTime = (timestamp, hour12 = true) => {
  //2022-03-14T14:40:00Z  =>  2022-03-14, 16:40 (UTC + local offset) formatted for datetime-local input
  if (!timestamp || isNaN(timestamp)) return "";
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  const newDate = date.toISOString().slice(0, 10);
  const hours = toLocalHours(timestamp, hour12);
  const minutes = toLocalMinutes(timestamp);
  const ampm = toLocalAMPM(timestamp);
  return newDate + ", " + hours + ":" + minutes + " " + ampm;
};

export const toLocalDateAndTimeWithSeconds = (timestamp, hour12 = true) => {
  //2022-03-14T14:40:00Z  =>  2022-03-14, 16:40:45 (UTC + local offset) formatted for datetime-local input
  if (!timestamp || isNaN(timestamp)) return "";
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const newDate = date.toISOString().slice(0, 10);
  const hours = toLocalHours(timestamp, hour12);
  const minutes = toLocalMinutes(timestamp);
  const seconds = toLocalSeconds(timestamp);
  const ampm = toLocalAMPM(timestamp);
  return newDate + ", " + hours + ":" + minutes + ":" + seconds + " " + ampm;
};

export const toLocalTime = (timestamp) => {
  //2022-03-14T14:40:00Z  =>  16:40 (UTC + local offset) formatted for datetime-local input
  if (!timestamp || isNaN(timestamp)) return "";
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); //milliseconds in local time zone
  const newTime = date.toISOString().slice(11, 16); //time in local time zone
  return newTime;
};

export const toLocalTimeWithSeconds = (timestamp) => {
  //2022-03-14T14:40:00Z  =>  16:40:25 (UTC + local offset) formatted for datetime-local input
  if (!timestamp || isNaN(timestamp)) return "";
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); //milliseconds in local time zone
  const newTime = date.toISOString().slice(11, 19); //time in local time zone
  return newTime;
};

export const toLocalHours = (timestamp, hour12 = true) => {
  if (!timestamp || isNaN(timestamp)) {
    return "";
  }
  const date = new Date(timestamp);
  let localHours = date.getHours();
  if (hour12) {
    if (localHours > 12) {
      localHours = localHours % 12;
    }
    if (localHours === 0) {
      localHours = 12;
    }
  }
  const localHoursString =
    localHours < 10 ? "0" + localHours.toString() : localHours.toString();
  return localHoursString;
};

export const toLocalMinutes = (timestamp) => {
  if (!timestamp || isNaN(timestamp)) return "";
  const newTime = toLocalTime(timestamp);
  return newTime.slice(3, 5);
};

export const toLocalSeconds = (timestamp) => {
  if (!timestamp || isNaN(timestamp)) return "";
  const newTime = toLocalTimeWithSeconds(timestamp);
  return newTime.slice(6, 8);
};

export const toLocalAMPM = (timestamp) => {
  if (!timestamp || isNaN(timestamp)) return "";
  const date = new Date(timestamp);
  let localHours = date.getHours();
  const AMPM = localHours < 12 ? "AM" : "PM";
  return AMPM;
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

export const fromLocalToISOStringNoMs = (
  localDate,
  localHours,
  localMinutes,
  localAMPM
) => {
  if (!localDate) return "";
  const localYear = localDate.slice(0, 4);
  const localMonth = (parseInt(localDate.slice(5, 7)) - 1).toString();
  const localDay = localDate.slice(8, 10);
  if (localAMPM === "AM" && localHours === "12") {
    localHours = "00";
  }
  if (localAMPM === "PM" && parseInt(localHours) < 12) {
    localHours = (parseInt(localHours) + 12).toString();
  }
  return toISOStringNoMs(
    new Date(localYear, localMonth, localDay, localHours, localMinutes)
  );
};

export const fromLocalDateToISOStringNoMs = (localDate) => {
  if (!localDate) return "";
  const localYear = localDate.slice(0, 4);
  const localMonth = (parseInt(localDate.slice(5, 7)) - 1).toString();
  const localDay = localDate.slice(8, 10);
  return toISOStringNoMs(new Date(localYear, localMonth, localDay));
};

export const getWeekRange = (firstDay) => {
  const curr = new Date();
  const currDate = curr.getDate();
  const currDay = curr.getDay();
  const currMonth = curr.getMonth();
  const currYear = curr.getFullYear();
  const daysInMonth = new Date(
    curr.getFullYear(),
    curr.getMonth() + 1,
    0
  ).getDate();
  const daysInPreviousMonth = new Date(
    curr.getFullYear(),
    curr.getMonth(),
    0
  ).getDate();

  //First Date of the week
  let startDate = new Date();
  let offset = 0;
  if (currDay >= firstDay) {
    offset = currDay - firstDay;
  } else {
    offset = 7 - (firstDay - currDay);
  }
  if (currDate - offset > 0) {
    //no need to change month
    startDate.setDate(currDate - offset);
  } else {
    //change month
    if (currMonth === 0) {
      //change year
      startDate.setMonth(11);
      startDate.setFullYear(currYear - 1);
    } else {
      startDate.setMonth(currMonth - 1);
    }
    startDate.setDate(daysInPreviousMonth + currDate - offset);
  }
  const startDateISO = toISOStringNoMs(
    new Date(startDate.setHours(0, 0, 0, 0))
  );

  //Last date of the week
  let endDate = new Date();
  endDate.setFullYear(startDate.getFullYear());
  endDate.setMonth(startDate.getMonth());
  if (startDate.getDate() + 7 <= daysInMonth) {
    endDate.setDate(startDate.getDate() + 7);
  } else {
    endDate.setDate(startDate.getDate() + 7 - daysInMonth);
    if (endDate.getMonth() === 11) {
      endDate.setFullYear(endDate.getFullYear() + 1);
      endDate.setMonth(0);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }
  }
  const endDateISO = toISOStringNoMs(new Date(endDate.setHours(0, 0, 0, 0)));
  return [startDateISO, endDateISO];
};

export const toDurationHours = (durationMs) => {
  const durationMin = durationMs / 60000;
  return parseInt(durationMin / 60);
};

export const toDurationMin = (durationMs) => {
  const durationMin = durationMs / 60000;
  return durationMin % 60;
};
