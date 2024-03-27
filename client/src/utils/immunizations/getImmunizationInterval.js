import { DateTime } from "luxon";
import { nowTZ } from "../dates/formatDates";

export const getImmunizationInterval = (
  age,
  patientDob,
  timezone = "America/Toronto"
) => {
  let rangeStart = nowTZ();
  let rangeEnd = nowTZ();
  const dob = DateTime.fromMillis(patientDob, { zone: timezone });

  switch (age) {
    case "2 Months": {
      rangeStart = dob.plus({ months: 2 });
      rangeEnd = dob.plus({ months: 3 });
      break;
    }
    case "4 Months": {
      rangeStart = dob.plus({ months: 4 });
      rangeEnd = dob.plus({ months: 5 });
      break;
    }
    case "6 Months": {
      rangeStart = dob.plus({ months: 6 });
      rangeEnd = dob.plus({ months: 7 });
      break;
    }
    case "1 Year": {
      rangeStart = dob.plus({ years: 1 });
      rangeEnd = dob.plus({ months: 16 });
      break;
    }
    case "15 Months": {
      rangeStart = dob.plus({ months: 15 });
      rangeEnd = dob.plus({ months: 16 });
      break;
    }
    case "18 Months": {
      rangeStart = dob.plus({ months: 18 });
      rangeEnd = dob.plus({ months: 19 });
      break;
    }
    case "4 Years": {
      rangeStart = dob.plus({ years: 4 });
      rangeEnd = dob.plus({ years: 5 });
      break;
    }
    case "14 Years": {
      rangeStart = dob.plus({ years: 14 });
      rangeEnd = dob.plus({ years: 15 });
      break;
    }
    case "24 Years": {
      rangeStart = dob.plus({ years: 24 });
      rangeEnd = dob.plus({ years: 25 });
      break;
    }
    case "Grade 7": {
      rangeStart = "";
      rangeEnd = dob.plus({ years: 15 });
      break;
    }
    case "65 Years": {
      rangeStart = dob.plus({ years: 65 });
      rangeEnd = dob.plus({ years: 66 });
      break;
    }
    default:
      break;
  }

  return {
    rangeStart: rangeStart ? rangeStart.toMillis() : 0,
    rangeEnd: rangeEnd.toMillis(),
  };
};
