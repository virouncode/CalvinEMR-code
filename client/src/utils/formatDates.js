//UTC

/*Takes a dateString from an input and creates a timestamp without UTC offset*/
export const toTimestampUTC = (dateString) => {
  //When receiving a dateString from an input "1984-04-25"
  //If there is time Date.parse("1984-04-25T12:00:00") will give the EQUIVALENT utc timestamp for 12:00:00 in my local time whereas Date.parse("1984-04-25T12:00:00Z") will be 12:00:00 in UTC
  return Date.parse(dateString + "Z");
};
/*Takes a timestamp in the database and displays date as if we were in UTC zone*/
export const toUTCDate = (timestamp) => {
  if (!timestamp || isNaN(timestamp)) return "";
  const date = new Date(timestamp);
  //UTC components of the date
  const year = date.getUTCFullYear();
  const month = ("0" + (date.getUTCMonth() + 1).toString()).slice(-2); // months index start at 0
  const day = ("0" + date.getUTCDate().toString()).slice(-2);
  const formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
};

//LOCAL

/*Takes a dateString from an input and creates a timestamp with UTC local offset*/
export const toTimestampLocal = (dateString) => {
  // Parse the date components from the date string
  const [year, month, day] = dateString.split("-").map(Number);
  // Create a Date object using the local time components (getTime() puts UTC offset)
  return new Date(year, month - 1, day).getTime();
};
/*Takes a timestamp in the database and displays date in the local timezone*/
export const toLocalDate = (timestamp) => {
  if (!timestamp || isNaN(timestamp)) return "";
  const date = new Date(timestamp);
  //local components of the date
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1).toString()).slice(-2); // months index start at 0
  const day = ("0" + date.getDate().toString()).slice(-2);
  const formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
};
export const toLocalTime = (timestamp, hour12 = true, withSeconds = false) => {
  //2022-03-14T14:40:00Z  =>  16:40 (UTC + local offset) formatted for datetime-local input
  if (!timestamp || isNaN(timestamp)) return "";
  const date = new Date(timestamp);
  let hours = parseInt(("0" + date.getHours().toString()).slice(-2));
  let hoursStr = "";
  const minutesStr = ("0" + date.getMinutes().toString()).slice(-2);
  const secondsStr = ("0" + date.getSeconds().toString()).slice(-2);
  let ampm = "";
  if (hour12) {
    ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // if hours = 0, it's midnight (12:00 AM)
    hoursStr = ("0" + hours.toString()).slice(-2);
  } else {
    hoursStr = hours.toString();
  }
  const formattedTime = withSeconds
    ? hoursStr + ":" + minutesStr + ":" + secondsStr + " " + ampm
    : hoursStr + ":" + minutesStr + " " + ampm;
  return formattedTime;
};

export const toLocalTimeWithSeconds = (timestamp, hour12 = true) => {
  //2022-03-14T14:40:00Z  =>  16:40:25 (UTC + local offset) formatted for datetime-local input
  if (!timestamp || isNaN(timestamp)) return "";
  return toLocalTime(timestamp, hour12, true);
};

export const toLocalDateAndTime = (timestamp, hour12 = true) => {
  if (!timestamp || isNaN(timestamp)) return "";
  const formattedDate = toLocalDate(timestamp);
  const formattedTime = toLocalTime(timestamp, hour12);
  return formattedDate + ", " + formattedTime;
};

export const toLocalDateAndTimeWithSeconds = (timestamp, hour12 = true) => {
  if (!timestamp || isNaN(timestamp)) return "";
  const formattedDate = toLocalDate(timestamp);
  const formattedTime = toLocalTime(timestamp, hour12, true);
  return formattedDate + ", " + formattedTime;
};

export const toLocalHours = (timestamp, hour12 = true) => {
  if (!timestamp || isNaN(timestamp)) {
    return "";
  }
  const date = new Date(timestamp);
  let hours = parseInt(("0" + date.getHours().toString()).slice(-2));
  let hoursStr = "";
  if (hour12) {
    hours = hours % 12;
    hours = hours ? hours : 12; // if hours = 0, it's midnight (12:00 AM)
    hoursStr = ("0" + hours.toString()).slice(-2);
  } else {
    hoursStr = hours.toString();
  }
  return hoursStr;
};

export const toLocalMinutes = (timestamp) => {
  if (!timestamp || isNaN(timestamp)) return "";
  const date = new Date(timestamp);
  const minutesStr = ("0" + date.getMinutes().toString()).slice(-2);
  return minutesStr;
};

export const toLocalSeconds = (timestamp) => {
  if (!timestamp || isNaN(timestamp)) return "";
  const date = new Date(timestamp);
  const secondsStr = ("0" + date.getSeconds().toString()).slice(-2);
  return secondsStr;
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
export const toISOStringNoMs = (date) => {
  return date.toISOString().slice(0, -5) + "Z";
};

//For my Appointments Forms : the user enters a date YYYY-MM-DD(in an input) and time
export const fromLocalComponentsToTimestamp = (
  localDate,
  localHours,
  localMinutes,
  localAMPM
) => {
  if (!localDate) return "";
  const localYear = parseInt(localDate.slice(0, 4));
  const localMonthIndex = parseInt(localDate.slice(5, 7)) - 1;
  const localDay = parseInt(localDate.slice(8, 10));
  if (localAMPM === "AM" && parseInt(localHours) === 12) {
    localHours = 0;
  }
  if (localAMPM === "PM" && parseInt(localHours) < 12) {
    localHours = parseInt(localHours) + 12;
  }
  return Date.parse(
    new Date(
      localYear,
      localMonthIndex,
      localDay,
      parseInt(localHours),
      parseInt(localMinutes)
    )
  );
};

export const getWeekRange = (firstDay) => {
  //Local components of today
  const curr = new Date();
  const currDate = curr.getDate();
  const currDay = curr.getDay();
  //Start Date of the week, we want to start from firstDay
  let startDate = new Date();
  let offset = 0;
  if (currDay >= firstDay) {
    //Wednesday>Monday for instance (3>1) offset 3-1 = 2
    offset = currDay - firstDay;
  } else {
    //Sunday<Monday  0<1 if we are Sunday we want to start the week on the preceding Monday : offset 7 - (1-0)
    offset = 7 - (firstDay - currDay);
  }
  startDate.setDate(currDate - offset);
  startDate.setHours(0, 0, 0, 0);
  let endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);
  return [Date.parse(startDate), Date.parse(endDate)];
};

export const toDurationHours = (durationMs) => {
  const durationMin = durationMs / 60000;
  return parseInt(durationMin / 60);
};

export const toDurationMin = (durationMs) => {
  const durationMin = durationMs / 60000;
  return durationMin % 60;
};

export const getLimitTimestampForAge = (age) => {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  let limit = new Date(today);
  limit = limit.setFullYear(limit.getFullYear() - age);
  return limit;
};
