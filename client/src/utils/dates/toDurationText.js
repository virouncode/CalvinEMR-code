export const toDurationText = (y, m, w, d, type, value) => {
  let yearText,
    monthText,
    weekText,
    daysText = "";
  if (type === "Y") {
    yearText = value
      ? value === 1
        ? `${value} year `
        : `${value} years `
      : "";
    monthText = m ? (m === 1 ? `${m} month ` : `${m} months `) : "";
    weekText = w ? (w === 1 ? `${w} week ` : `${w} weeks `) : "";
    daysText = d ? (d === 1 ? `${d} day ` : `${d} days `) : "";
  } else if (type === "M") {
    yearText = y ? (y === 1 ? `${y} year ` : `${y} years `) : "";
    monthText = value
      ? value === 1
        ? `${value} month `
        : `${value} months `
      : "";
    weekText = w ? (w === 1 ? `${w} week ` : `${w} weeks `) : "";
    daysText = d ? (d === 1 ? `${d} day ` : `${d} days `) : "";
  } else if (type === "W") {
    yearText = y ? (y === 1 ? `${y} year ` : `${y} years `) : "";
    monthText = m ? (m === 1 ? `${m} month ` : `${m} months `) : "";
    weekText = value
      ? value === 1
        ? `${value} week `
        : `${value} weeks `
      : "";
    daysText = d ? (d === 1 ? `${d} day ` : `${d} days `) : "";
  } else if (type === "D") {
    yearText = y ? (y === 1 ? `${y} year ` : `${y} years `) : "";
    monthText = m ? (m === 1 ? `${m} month ` : `${m} months `) : "";
    weekText = w ? (w === 1 ? `${w} week ` : `${w} weeks `) : "";
    daysText = value ? (value === 1 ? `${value} day ` : `${value} days `) : "";
  }
  return yearText + monthText + weekText + daysText;
};
