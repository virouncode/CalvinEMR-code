import { LineChart } from "@mui/x-charts/LineChart";
import React from "react";
import { toDatasToPlot } from "../../../../../utils/charts/toDatasToPlot";
import { toYDataKey } from "../../../../../utils/charts/toYDataKey";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";

const CareElementHistory = ({ historyTopic, historyDatas, historyUnit }) => {
  const datasToPlot = toDatasToPlot(historyTopic, historyDatas);
  const yDataKey = toYDataKey(historyTopic);
  const keyToLabel = {
    SystolicBP: "Systolic",
    DiastolicBP: "Diastolic",
  };
  const colors = { SystolicBP: "#76b7b2", DiastolicBP: "#e15759" };
  const valueFormatter = (date) =>
    date.toLocaleDateString("en-CA", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  const yFormatter = (value) => `${value} ${historyUnit}`;

  return (
    <div className="care-elements__history-container">
      {historyDatas.length > 1 ? (
        <LineChart
          xAxis={[
            {
              dataKey: "Date",
              valueFormatter,
              label: "Date",
              scaleType: "time",
              tickMinStep: 3600 * 1000 * 12, // min step: 24h
            },
          ]}
          series={
            historyTopic !== "BLOOD PRESSURE"
              ? [
                  {
                    dataKey: yDataKey,
                    label: `${firstLetterOfFirstWordUpper(
                      historyTopic
                        .replace("LBS", "")
                        .replace("FEET", "")
                        .toLowerCase()
                    )} (${historyUnit})`,
                    type: "line",
                    curve: historyTopic.includes("STATUS")
                      ? "stepAfter"
                      : "linear",
                    color: "#76b7b2",
                    valueFormatter: yFormatter,
                  },
                ]
              : Object.keys(keyToLabel).map((key) => ({
                  dataKey: key,
                  label: `${keyToLabel[key]} (${historyUnit})`,
                  type: "line",
                  curve: historyTopic.includes("STATUS")
                    ? "stepAfter"
                    : "linear",
                  color: colors[key],
                  valueFormatter: yFormatter,
                }))
          }
          dataset={datasToPlot}
          width={500}
          height={350}
          sx={{
            ".MuiLineElement-root": {
              strokeWidth: 2,
            },
            ".MuiMarkElement-root": {
              stroke: "#8884d8",
              scale: "0.6",
              fill: "#fff",
              strokeWidth: 2,
            },
          }}
          slotProps={{
            legend: {
              direction: "row",
              position: {
                vertical: "top",
                horizontal: "right",
              },
              labelStyle: {
                fontSize: 12,
              },
              itemMarkWidth: 20,
              itemMarkHeight: 2,
              markGap: 5,
              itemGap: 10,
            },
          }}
        />
      ) : (
        <p>No previous datas</p>
      )}
    </div>
  );
};

export default CareElementHistory;
