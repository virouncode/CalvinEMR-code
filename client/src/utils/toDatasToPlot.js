export const toDatasToPlot = (historyTopic, historyDatas) => {
  let datasToPlot;
  switch (historyTopic) {
    case "SMOKING STATUS":
      datasToPlot = historyDatas.map((data) => {
        return { ...data, Status: data.Status === "Y" ? 1 : 0 };
      });
      break;
    case "SMOKING PACKS PER DAY":
      datasToPlot = historyDatas.map((data) => {
        return { ...data, PerDay: data.PerDay ? parseFloat(data.PerDay) : 0 };
      });
      break;
    case "WEIGHT":
      datasToPlot = historyDatas.map((data) => {
        return { ...data, Weight: data.Weight ? parseFloat(data.Weight) : 0 };
      });
      break;
    case "HEIGHT":
      datasToPlot = historyDatas.map((data) => {
        return { ...data, Height: data.Height ? parseFloat(data.Height) : 0 };
      });
      break;
    case "WAIST CIRCUMFERENCE":
      datasToPlot = historyDatas.map((data) => {
        return {
          ...data,
          WaistCircumference: data.WaistCircumference
            ? parseFloat(data.WaistCircumference)
            : 0,
        };
      });
      break;
    case "BLOOD PRESSURE":
      datasToPlot = historyDatas.map((data) => {
        return {
          Date: data.Date,
          SystolicBP: data.SystolicBP ? parseFloat(data.SystolicBP) : 0,
          DiastolicBP: data.DiastolicBP ? parseFloat(data.DiastolicBP) : 0,
        };
      });
      break;
    case "BODY MASS INDEX":
      datasToPlot = historyDatas.map((data) => {
        return { ...data, BMI: data.BMI ? parseFloat(data.BMI) : 0 };
      });
      break;
    case "BODY SURFACE AREA":
      datasToPlot = historyDatas.map((data) => {
        return { ...data, BSA: data.BSA ? parseFloat(data.BSA) : 0 };
      });
      break;
    default:
      break;
  }
  return datasToPlot;
};
