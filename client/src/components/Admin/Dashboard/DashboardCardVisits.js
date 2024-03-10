import { BarChart } from "@mui/x-charts/BarChart";
import React, { useEffect, useState } from "react";
import {
  getLimitTimestampForAge,
  toLocalDate,
} from "../../../utils/formatDates";
import EmptyParagraph from "../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../All/UI/Tables/LoadingParagraph";

const DashboardCardVisits = ({
  visits,
  setVisits,
  rangeStartVisits,
  setRangeStartVisits,
  rangeEndVisits,
  setRangeEndVisits,
  loadingVisits,
  setLoadingVisits,
  errVisits,
  setErrVisits,
  sites,
}) => {
  console.log("sites", sites);
  console.log(visits);

  const [visitsPerGender, setVisitsPerGender] = useState();
  const [visitsPerAge, setVisitsPerAge] = useState();

  useEffect(() => {
    if (!sites || sites?.length === 0 || !visits || visits?.length === 0)
      return;
    let totalsBySite = [];
    //By site
    for (const site of sites) {
      let nbrOfMale = 0;
      let nbrOfFemale = 0;
      let nbrOfOther = 0;
      const visitsForSite = visits.filter(({ site_id }) => site_id === site.id);
      for (const visit of visitsForSite) {
        nbrOfMale += visit.patients_guests_ids.filter(
          ({ patient_infos }) => patient_infos?.Gender === "M"
        ).length;
        nbrOfFemale += visit.patients_guests_ids.filter(
          ({ patient_infos }) => patient_infos?.Gender === "F"
        ).length;
        nbrOfOther += visit.patients_guests_ids.filter(
          ({ patient_infos }) => patient_infos?.Gender === "O"
        ).length;
      }
      totalsBySite = [
        ...totalsBySite,
        { male: nbrOfMale, female: nbrOfFemale, other: nbrOfOther },
      ];
    }
    const totals = {
      male: totalsBySite.reduce((acc, current) => {
        return acc + current.male;
      }, 0),
      female: totalsBySite.reduce((acc, current) => {
        return acc + current.female;
      }, 0),
      other: totalsBySite.reduce((acc, current) => {
        return acc + current.other;
      }, 0),
    };
    setVisitsPerGender([...totalsBySite, totals]);
  }, [sites, visits]);

  useEffect(() => {
    if (!sites || sites?.length === 0 || !visits || visits?.length === 0)
      return;
    let totalsBySite = [];
    //By site
    for (const site of sites) {
      let nbrOfUnder18 = 0;
      let nbrOf1835 = 0;
      let nbrOf3650 = 0;
      let nbrOf5170 = 0;
      let nbrOfOver70 = 0;

      const visitsForSite = visits.filter(({ site_id }) => site_id === site.id);

      for (const visit of visitsForSite) {
        nbrOfUnder18 += visit.patients_guests_ids.filter(
          ({ patient_infos }) =>
            patient_infos?.DateOfBirth > getLimitTimestampForAge(18)
        ).length;
        nbrOf1835 += visit.patients_guests_ids.filter(
          ({ patient_infos }) =>
            patient_infos?.DateOfBirth <= getLimitTimestampForAge(18) &&
            patient_infos?.DateOfBirth >= getLimitTimestampForAge(35)
        ).length;
        nbrOf3650 += visit.patients_guests_ids.filter(
          ({ patient_infos }) =>
            patient_infos?.DateOfBirth <= getLimitTimestampForAge(36) &&
            patient_infos?.DateOfBirth >= getLimitTimestampForAge(50)
        ).length;
        nbrOf5170 += visit.patients_guests_ids.filter(
          ({ patient_infos }) =>
            patient_infos?.DateOfBirth <= getLimitTimestampForAge(51) &&
            patient_infos?.DateOfBirth >= getLimitTimestampForAge(70)
        ).length;
        nbrOfOver70 += visit.patients_guests_ids.filter(
          ({ patient_infos }) =>
            patient_infos?.DateOfBirth < getLimitTimestampForAge(70)
        ).length;
      }
      totalsBySite = [
        ...totalsBySite,
        {
          under18: nbrOfUnder18,
          from18to35: nbrOf1835,
          from36to50: nbrOf3650,
          from51to70: nbrOf5170,
          over70: nbrOfOver70,
        },
      ];
    }
    const totals = {
      under18: totalsBySite.reduce((acc, current) => {
        return acc + current.under18;
      }, 0),
      from18to35: totalsBySite.reduce((acc, current) => {
        return acc + current.from18to35;
      }, 0),
      from36to50: totalsBySite.reduce((acc, current) => {
        return acc + current.from36to50;
      }, 0),
      from51to70: totalsBySite.reduce((acc, current) => {
        return acc + current.from51to70;
      }, 0),
      over70: totalsBySite.reduce((acc, current) => {
        return acc + current.over70;
      }, 0),
    };
    setVisitsPerAge([...totalsBySite, totals]);
  }, [sites, visits]);

  const handleChangeStart = (e) => {
    const value = e.target.value;
    setRangeStartVisits(value === "" ? null : Date.parse(new Date(value)));
  };
  const handleChangeEnd = (e) => {
    const value = e.target.value;
    setRangeEndVisits(value === "" ? null : Date.parse(new Date(value)));
  };
  return (
    visits &&
    visitsPerGender && (
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
          <div>
            <label htmlFor="">Total visits: </label>
            {visitsPerGender.slice(-1)[0].male +
              visitsPerGender.slice(-1)[0].female +
              visitsPerGender.slice(-1)[0].other}
          </div>
        </div>

        {errVisits && <p className="dashboard-card__err">{errVisits}</p>}
        {!errVisits &&
        visits?.length > 0 &&
        sites?.length > 0 &&
        visitsPerGender?.length > 0 ? (
          <div className="dashboard-card__content">
            <BarChart
              xAxis={[
                {
                  data: [...sites.map(({ name }) => name), "Total"],
                  scaleType: "band",
                },
              ]}
              dataset={visitsPerGender}
              series={[
                { dataKey: "male", label: "Males" },
                { dataKey: "female", label: "Females" },
                { dataKey: "other", label: "Others" },
              ]}
              width={500}
              height={350}
            />
            <BarChart
              xAxis={[
                {
                  data: [...sites.map(({ name }) => name), "Total"],
                  scaleType: "band",
                },
              ]}
              dataset={visitsPerAge}
              series={[
                { dataKey: "under18", label: "<18" },
                { dataKey: "from18to35", label: "18-35" },
                { dataKey: "from36to50", label: "36-50" },
                { dataKey: "from51to70", label: "51-70" },
                { dataKey: "over70", label: ">70" },
              ]}
              width={500}
              height={350}
            />
          </div>
        ) : (
          !loadingVisits && <EmptyParagraph text="No visits in this range" />
        )}
        {loadingVisits && <LoadingParagraph />}
      </div>
    )
  );
};

export default DashboardCardVisits;
