export const getVaccinationInterval = (age, date_of_birth) => {
  let rangeStart = new Date();
  let rangeEnd = new Date();
  const dob = new Date(date_of_birth);

  switch (age) {
    case "2 Months": {
      rangeStart = new Date(dob.setMonth(dob.getMonth() + 2));
      rangeEnd = new Date(dob.setMonth(dob.getMonth() + 1));
      break;
    }
    case "4 Months": {
      rangeStart = new Date(dob.setMonth(dob.getMonth() + 4));
      rangeEnd = new Date(dob.setMonth(dob.getMonth() + 1));
      break;
    }
    case "6 Months": {
      rangeStart = new Date(dob.setMonth(dob.getMonth() + 6));
      rangeEnd = new Date(dob.setMonth(dob.getMonth() + 1));
      break;
    }
    case "1 Year": {
      rangeStart = new Date(dob.setFullYear(dob.getFullYear() + 1));
      rangeEnd = new Date(dob.setMonth(dob.getMonth() + 4));
      break;
    }
    case "15 Months": {
      rangeStart = new Date(dob.setMonth(dob.getMonth() + 15));
      rangeEnd = new Date(dob.setMonth(dob.getMonth() + 1));
      break;
    }
    case "18 Months": {
      rangeStart = new Date(dob.setMonth(dob.getMonth() + 18));
      rangeEnd = new Date(dob.setMonth(dob.getMonth() + 1));
      break;
    }
    case "4 Years": {
      rangeStart = new Date(dob.setFullYear(dob.getFullYear() + 4));
      rangeEnd = new Date(dob.setFullYear(dob.getFullYear() + 1));
      break;
    }
    case "14 Years": {
      rangeStart = new Date(dob.setFullYear(dob.getFullYear() + 14));
      rangeEnd = new Date(dob.setFullYear(dob.getFullYear() + 1));
      break;
    }
    case "24 Years": {
      rangeStart = new Date(dob.setFullYear(dob.getFullYear() + 24));
      rangeEnd = new Date(dob.setFullYear(dob.getFullYear() + 1));
      break;
    }
    case "Grade 7": {
      rangeStart = "";
      rangeEnd = new Date(dob.setFullYear(dob.getFullYear() + 15));
      break;
    }
    case "65 Years": {
      rangeStart = new Date(dob.setFullYear(dob.getFullYear() + 65));
      rangeEnd = new Date(dob.setFullYear(dob.getFullYear() + 1));
      break;
    }
    default:
      break;
  }
  return {
    rangeStart: Date.parse(rangeStart),
    rangeEnd: Date.parse(rangeEnd),
  };
};
