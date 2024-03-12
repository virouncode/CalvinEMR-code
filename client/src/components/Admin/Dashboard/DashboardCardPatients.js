import { BarChart } from "@mui/x-charts/BarChart";
import React from "react";
import EmptyParagraph from "../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../All/UI/Tables/LoadingParagraph";

const DashboardCardPatients = ({
  sites,
  patientsPerGender,
  loadingPatientsPerGender,
  errPatientsPerGender,
  patientsPerAge,
  loadingPatientsPerAge,
  errPatientsPerAge,
}) => {
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

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__title">Patients</div>
      <div className="dashboard-card__total">
        <label htmlFor="">Total patients: </label>
        {patientsPerGender.length > 0
          ? patientsPerGender.slice(-1)[0]["M"] +
            patientsPerGender.slice(-1)[0]["F"] +
            patientsPerGender.slice(-1)[0]["O"]
          : "0"}
      </div>
      <div className="dashboard-card__content">
        <div className="dashboard-card__chart">
          <p className="dashboard-card__chart-title">By gender</p>
          {errPatientsPerGender && (
            <p className="dashboard-card__chart-err">{errPatientsPerGender}</p>
          )}
          {!errPatientsPerGender &&
            (patientsPerGender?.length > 0 ? (
              <BarChart
                dataset={patientsPerGender}
                series={[
                  { dataKey: "M", label: "Males" },
                  { dataKey: "F", label: "Females" },
                  { dataKey: "O", label: "Others" },
                ]}
                {...chartSetting}
              />
            ) : (
              !loadingPatientsPerGender && (
                <EmptyParagraph text="No patients by gender available" />
              )
            ))}
          {loadingPatientsPerGender && <LoadingParagraph />}
        </div>
        <div className="dashboard-card__chart">
          <p className="dashboard-card__chart-title">By age range</p>
          {errPatientsPerAge && (
            <p className="dashboard-card__chart-err">{errPatientsPerAge}</p>
          )}
          {!errPatientsPerAge &&
            (patientsPerAge?.length > 0 ? (
              <BarChart
                dataset={patientsPerAge}
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
              !loadingPatientsPerAge && (
                <EmptyParagraph text="No patients by age available" />
              )
            ))}
          {loadingPatientsPerAge && <LoadingParagraph />}
        </div>
      </div>
    </div>
  );
};

export default DashboardCardPatients;
