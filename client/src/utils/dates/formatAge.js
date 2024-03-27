export const formatAge = (age) => {
  switch (age) {
    case "2_months":
      return "2 Months";
    case "4_months":
      return "4 Months";
    case "6_months":
      return "6 Months";
    case "15_months":
      return "15 Months";
    case "18_months":
      return "18 Months";
    case "1_year":
      return "1 Year";
    case "4_years":
      return "4 Years";
    case "14_years":
      return "14 Years";
    case "24_years":
      return "24 Years";
    case "34_years":
      return ">= 34 Years";
    case "65_years":
      return "65 Years";
    case "grade_7":
      return "Grade 7";
    default:
      break;
  }
};
