import { BarChart } from "@mui/x-charts/BarChart";
import React from "react";
import useVisitsPerAge from "../../../hooks/useVisitsPerAge";
import useVisitsPerGender from "../../../hooks/useVistsPerGender";
import { toLocalDate } from "../../../utils/formatDates";
import EmptyParagraph from "../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../All/UI/Tables/LoadingParagraph";

const DashboardCardVisits = ({
  visits,
  rangeStartVisits,
  setRangeStartVisits,
  rangeEndVisits,
  setRangeEndVisits,
  loadingVisits,
  errVisits,
  sites,
}) => {
  const { visitsPerGender } = useVisitsPerGender(sites, visits);
  const { visitsPerAge } = useVisitsPerAge(sites, visits);
  const chartSetting = {
    xAxis: [
      {
        data: [...sites.map(({ name }) => name), "Total"],
        scaleType: "band",
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
    setRangeStartVisits(value === "" ? null : Date.parse(new Date(value)));
  };
  const handleChangeEnd = (e) => {
    const value = e.target.value;
    setRangeEndVisits(value === "" ? null : Date.parse(new Date(value)));
  };
  return (
    <div className="dashboard-card">
      <div className="dashboard-card__title">Visits</div>
      <div className="dashboard-card__filter">
        <div>
          <label htmlFor="">From</label>
          <input
            type="date"
            onChange={handleChangeStart}
            value={toLocalDate(rangeStartVisits)}
          />
          <label htmlFor="">To</label>
          <input
            type="date"
            onChange={handleChangeEnd}
            value={toLocalDate(rangeEndVisits)}
          />
        </div>
        {visitsPerGender.length > 0 ? (
          <div>
            <label htmlFor="">Total visits: </label>
            {visitsPerGender.slice(-1)[0].male +
              visitsPerGender.slice(-1)[0].female +
              visitsPerGender.slice(-1)[0].other}
          </div>
        ) : (
          <div>No visits</div>
        )}
      </div>
      {errVisits && <p className="dashboard-card__err">{errVisits}</p>}
      {!errVisits &&
        (visits?.length > 0 ? (
          <div className="dashboard-card__content">
            <div className="dashboard-card__chart">
              <p className="dashboard-card__chart-title">By gender</p>
              {visitsPerGender?.length > 0 ? (
                <BarChart
                  dataset={visitsPerGender}
                  series={[
                    { dataKey: "male", label: "Males" },
                    { dataKey: "female", label: "Females" },
                    { dataKey: "other", label: "Others" },
                  ]}
                  {...chartSetting}
                />
              ) : (
                <EmptyParagraph text="No visits per gender available" />
              )}
            </div>
            <div className="dashboard-card__chart">
              <p className="dashboard-card__chart-title">By age range</p>
              {visitsPerAge.length > 0 ? (
                <BarChart
                  dataset={visitsPerAge}
                  series={[
                    { dataKey: "under18", label: "<18" },
                    { dataKey: "from18to35", label: "18-35" },
                    { dataKey: "from36to50", label: "36-50" },
                    { dataKey: "from51to70", label: "51-70" },
                    { dataKey: "over70", label: ">70" },
                  ]}
                  {...chartSetting}
                />
              ) : (
                <EmptyParagraph text="No visits per age available" />
              )}
            </div>
          </div>
        ) : (
          !loadingVisits && <EmptyParagraph text="No visits in this range" />
        ))}
      {loadingVisits && <LoadingParagraph />}
    </div>
  );
};

export default DashboardCardVisits;
