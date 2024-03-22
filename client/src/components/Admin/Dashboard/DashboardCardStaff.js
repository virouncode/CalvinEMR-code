import { BarChart } from "@mui/x-charts/BarChart";
import React from "react";
import useStaffDuration from "../../../hooks/useStaffDuration";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useStaffPerCategory from "../../../hooks/useStaffPerCategory";
import EmptyParagraph from "../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../All/UI/Tables/LoadingParagraph";

const DashboardCardStaff = ({ sites, loadingSites, errSites }) => {
  const { staffInfos } = useStaffInfosContext();
  const categoriesData = [
    "Doctors",
    "Medical students",
    "Nurses",
    "Nursing students",
    "Secretaries",
    "Ultra sound techs",
    "Lab techs",
    "Nutritionists",
    "Physiotherapists",
    "Psychologists",
    "Others",
  ];
  const colorsPalette = [
    "#0CB2AF",
    "#2E96FF",
    "#B800D8",
    "#60009B",
    "#2731C8",
    "#ffe119",
    "#e6194b",
    "#3cb44b",
    "#f58231",
    "#911eb4",
    "#42d4f4",
  ];

  const { staffPerCategory } = useStaffPerCategory(sites);
  const { staffDuration } = useStaffDuration(sites);

  const chartSettingDuration = {
    xAxis: [
      {
        data: [...sites.map(({ name }) => name), "Total"],
        scaleType: "band",
      },
    ],
    yAxis: [
      {
        label: "days",
      },
    ],
    width: 500,
    height: 400,
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
  const chartSettingCategory = {
    xAxis: [
      {
        data: [...sites.map(({ name }) => name), "Total"],
        scaleType: "band",
      },
    ],
    yAxis: [
      {
        label: "people",
      },
    ],
    width: 500,
    height: 400,
    margin: { top: 90 },
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
  return (
    staffPerCategory && (
      <div className="dashboard-card">
        <div className="dashboard-card__title">Staff members</div>
        <div className="dashboard-card__total">
          <label htmlFor="">Total staff members: </label>
          {staffInfos.length}
        </div>
        {staffPerCategory.length > 0 && staffDuration.length > 0 ? (
          <div className="dashboard-card__content">
            <div className="dashboard-card__chart">
              <p className="dashboard-card__chart-title">By occupation</p>
              <BarChart
                dataset={staffPerCategory}
                series={categoriesData.map((category, index) => {
                  return {
                    dataKey: category,
                    label: category,
                    color: colorsPalette[index],
                  };
                })}
                {...chartSettingCategory}
              />
            </div>
            <div className="dashboard-card__chart">
              <p className="dashboard-card__chart-title">
                By employment duration
              </p>
              <BarChart
                dataset={staffDuration}
                series={[
                  {
                    dataKey: "shortest",
                    label: "Shortest",
                    valueFormatter: (value) => `${value} days`,
                  },
                  {
                    dataKey: "longest",
                    label: "Longest",
                    valueFormatter: (value) => `${value} days`,
                  },
                ]}
                {...chartSettingDuration}
              />
            </div>
          </div>
        ) : (
          !loadingSites && <EmptyParagraph text="No staff members" />
        )}
        {loadingSites && <LoadingParagraph />}
      </div>
    )
  );
};

export default DashboardCardStaff;
