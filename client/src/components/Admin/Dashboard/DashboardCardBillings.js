import { BarChart } from "@mui/x-charts/BarChart";
import React from "react";
import useRevenues from "../../../hooks/useRevenues";
import useTop10BillingCodes from "../../../hooks/useTop10BillingCodes";
import useTop10Diagnosis from "../../../hooks/useTop10Diagnosis";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../utils/formatDates";
import EmptyParagraph from "../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../All/UI/Tables/LoadingParagraph";

const DashboardCardBillings = ({
  billings,
  rangeStartBillings,
  setRangeStartBillings,
  rangeEndBillings,
  setRangeEndBillings,
  loadingBillings,
  errBillings,
  sites,
}) => {
  const { revenues } = useRevenues(billings, sites);
  const { top10Diagnosis } = useTop10Diagnosis(billings, sites);
  const { top10BillingCodes } = useTop10BillingCodes(billings, sites);
  const chartSetting = {
    xAxis: [
      {
        data: [...sites.map(({ name }) => name), "Total"],
        scaleType: "band",
      },
    ],
    yAxis: [
      {
        label: "dollars",
      },
    ],
    width: 500,
    height: 350,
    slotProps: {
      legend: {
        direction: "row",
        position: {
          vertical: "top",
          horizontal: "center",
        },
        labelStyle: {
          fontSize: 12,
        },
        itemMarkWidth: 10,
        itemMarkHeight: 10,
        markGap: 5,
        itemGap: 10,
      },
    },
  };
  const chartSettingDiagnosis = {
    xAxis: [
      {
        data: [...sites.map(({ name }) => name), "Total"],
        scaleType: "band",
      },
    ],
    yAxis: [
      {
        label: "frequency",
      },
    ],
    width: 500,
    height: 350,
    slotProps: {
      legend: { hidden: true },
    },
  };

  const handleChangeStart = (e) => {
    const value = e.target.value;
    setRangeStartBillings(value === "" ? null : dateISOToTimestampTZ(value));
  };
  const handleChangeEnd = (e) => {
    const value = e.target.value;
    setRangeEndBillings(value === "" ? null : dateISOToTimestampTZ(value));
  };
  return (
    <div className="dashboard-card">
      <div className="dashboard-card__title">Billings</div>
      <div className="dashboard-card__filter">
        <div>
          <label htmlFor="">From</label>
          <input
            type="date"
            onChange={handleChangeStart}
            value={timestampToDateISOTZ(rangeStartBillings, "America/Toronto")}
          />
          <label htmlFor="">To</label>
          <input
            type="date"
            onChange={handleChangeEnd}
            value={timestampToDateISOTZ(rangeEndBillings, "America/Toronto")}
          />
        </div>
        {billings.length > 0 ? (
          <div>
            <label htmlFor="">Total revenues: </label>
            {billings.reduce(
              (acc, current) =>
                acc +
                current.billing_infos.anaesthetist_fee +
                current.billing_infos.assistant_fee +
                current.billing_infos.non_anaesthetist_fee +
                current.billing_infos.provider_fee +
                current.billing_infos.specialist_fee,
              0
            ) / 1000}
            {" $"}
          </div>
        ) : (
          <div>No revenues</div>
        )}
      </div>
      {errBillings && <p className="dashboard-card__err">{errBillings}</p>}
      {!errBillings &&
        (billings.length > 0 ? (
          <div className="dashboard-card__content">
            <div className="dashboard-card__chart">
              <p className="dashboard-card__chart-title">Revenues</p>
              {revenues.length > 0 ? (
                <BarChart
                  dataset={revenues}
                  series={[
                    {
                      dataKey: "revenue",
                      label: "Revenue",
                      valueFormatter: (value) => `${value} $`,
                    },
                  ]}
                  {...chartSetting}
                />
              ) : (
                <EmptyParagraph text="No revenue available" />
              )}
            </div>
            <div className="dashboard-card__chart">
              <p className="dashboard-card__chart-title">Top diagnoses</p>
              {top10Diagnosis.length > 0 ? (
                <BarChart
                  dataset={top10Diagnosis}
                  series={top10Diagnosis.reduce((acc, item) => {
                    return acc.concat(
                      Object.keys(item).map((key) => {
                        return { dataKey: key, label: key };
                      })
                    );
                  }, [])}
                  {...chartSettingDiagnosis}
                />
              ) : (
                <EmptyParagraph text="No top diagnoses available" />
              )}
            </div>
            <div className="dashboard-card__chart">
              <p className="dashboard-card__chart-title">Top billing codes</p>
              {top10BillingCodes.length > 0 ? (
                <BarChart
                  dataset={top10BillingCodes}
                  series={top10BillingCodes.reduce((acc, item) => {
                    return acc.concat(
                      Object.keys(item).map((key) => {
                        return { dataKey: key, label: key };
                      })
                    );
                  }, [])}
                  {...chartSettingDiagnosis}
                />
              ) : (
                <EmptyParagraph text="No top billing codes available" />
              )}
            </div>
          </div>
        ) : (
          !loadingBillings && (
            <EmptyParagraph text="No billings in this range" />
          )
        ))}
      {loadingBillings && <LoadingParagraph />}
    </div>
  );
};

export default DashboardCardBillings;
