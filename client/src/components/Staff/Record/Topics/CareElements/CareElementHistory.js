import { LineChart } from "@mui/x-charts/LineChart";
import React from "react";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { toDatasToPlot } from "../../../../../utils/toDatasToPlot";
import { toYDataKey } from "../../../../../utils/toYDataKey";

const CareElementHistory = ({ historyTopic, historyDatas }) => {
  const datasToPlot = toDatasToPlot(historyTopic, historyDatas);
  const yDataKey = toYDataKey(historyTopic);
  const keyToLabel = {
    SystolicBP: "Systolic",
    DiastolicBP: "Diastolic",
  };
  const colors = { SystolicBP: "#76b7b2", DiastolicBP: "#e15759" };

  return (
    <div className="care-elements__history-container">
      {historyDatas.length > 1 ? (
        <LineChart
          xAxis={[
            {
              dataKey: "Date",
              valueFormatter: (v) => toLocalDate(v),
              label: "Date",
              scaleType: "point",
            },
          ]}
          series={
            historyTopic !== "BLOOD PRESSURE"
              ? [
                  {
                    dataKey: yDataKey,
                    label: firstLetterOfFirstWordUpper(
                      historyTopic.toLowerCase()
                    ),
                    type: "line",
                    curve: historyTopic.includes("STATUS")
                      ? "stepAfter"
                      : "linear",
                    color: "#76b7b2",
                  },
                ]
              : Object.keys(keyToLabel).map((key) => ({
                  dataKey: key,
                  label: keyToLabel[key],
                  type: "line",
                  curve: historyTopic.includes("STATUS")
                    ? "stepAfter"
                    : "linear",
                  color: colors[key],
                }))
          }
          dataset={datasToPlot}
          width={500}
          height={350}
        />
      ) : (
        <p>No previous datas</p>
      )}
    </div>
  );
};

export default CareElementHistory;
