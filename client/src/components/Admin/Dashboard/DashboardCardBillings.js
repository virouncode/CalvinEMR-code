import { BarChart } from "@mui/x-charts/BarChart";
import React, { useState } from "react";
import useRevenues from "../../../hooks/useRevenues";
import useTop10BillingCodes from "../../../hooks/useTop10BillingCodes";
import useTop10Diagnosis from "../../../hooks/useTop10Diagnosis";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../utils/formatDates";
import EmptyParagraph from "../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../All/UI/Tables/LoadingParagraph";
import SelectSite from "../../Staff/EventForm/SelectSite";

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
  const [siteSelectedIdDiagnoses, setSiteSelectedIdDiagnoses] = useState(-1);
  const [siteSelectedIdBillingCodes, setSiteSelectedIdBillingCodes] =
    useState(-1);
  const { revenues } = useRevenues(billings, sites);
  const { top10Diagnosis } = useTop10Diagnosis(
    billings,
    sites,
    siteSelectedIdDiagnoses
  );
  const { top10BillingCodes } = useTop10BillingCodes(
    billings,
    sites,
    siteSelectedIdBillingCodes
  );
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

  const handleChangeStart = (e) => {
    const value = e.target.value;
    setRangeStartBillings(value === "" ? null : dateISOToTimestampTZ(value));
  };
  const handleChangeEnd = (e) => {
    const value = e.target.value;
    setRangeEndBillings(value === "" ? null : dateISOToTimestampTZ(value));
  };
  const handleSiteChangeDiagnoses = (e) => {
    setSiteSelectedIdDiagnoses(parseInt(e.target.value));
  };
  const handleSiteChangeBillingCodes = (e) => {
    setSiteSelectedIdBillingCodes(parseInt(e.target.value));
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
            <div className="dashboard-card__ranking">
              <p className="dashboard-card__ranking-title">Top diagnoses</p>
              <SelectSite
                handleSiteChange={handleSiteChangeDiagnoses}
                sites={sites}
                value={siteSelectedIdDiagnoses}
                all={true}
              />
              {top10Diagnosis.length > 0 ? (
                <ul className="dashboard-card__ranking-content">
                  {top10Diagnosis.map((item, index) => (
                    <li key={item.id} className="dashboard-card__ranking-item">
                      <span className="dashboard-card__ranking-item-nbr">
                        {index + 1}:
                      </span>{" "}
                      <span>
                        {item.diagnosis} ({item.frequency})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyParagraph text="Not enough datas" />
              )}
            </div>
            <div className="dashboard-card__ranking">
              <p className="dashboard-card__ranking-title">Top billing codes</p>
              <SelectSite
                handleSiteChange={handleSiteChangeBillingCodes}
                sites={sites}
                value={siteSelectedIdBillingCodes}
                all={true}
              />
              {top10BillingCodes.length > 0 ? (
                <ul className="dashboard-card__ranking-content">
                  {top10BillingCodes.map((item, index) => (
                    <li key={item.id} className="dashboard-card__ranking-item">
                      <span className="dashboard-card__ranking-item-nbr">
                        {index + 1}:
                      </span>{" "}
                      <span>
                        {item.billing_code} ({item.frequency})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyParagraph text="Not enough datas" />
              )}
            </div>
            <div
              className="dashboard-card__chart"
              style={{ width: "100%", marginTop: "20px" }}
            >
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
