export const toYDataKey = (historyTopic) => {
  if (historyTopic === "SMOKING STATUS") {
    return "Status";
  } else if (historyTopic === "SMOKING PACKS PER DAY") {
    return "PerDay";
  } else if (historyTopic === "WEIGHT") {
    return "Weight";
  } else if (historyTopic === "HEIGHT") {
    return "Height";
  } else if (historyTopic === "WAIST CIRCUMFERENCE") {
    return "WaistCircumference";
  } else if (historyTopic === "BLOOD PRESSURE") {
    return "";
  } else if (historyTopic === "BODY MASS INDEX") {
    return "BMI";
  } else if (historyTopic === "BODY SURFACE AREA") {
    return "BSA";
  } else {
    return "";
  }
};
