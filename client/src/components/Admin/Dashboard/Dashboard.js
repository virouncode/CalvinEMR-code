import React, { useState } from "react";
import useFetchDashboard from "../../../hooks/useFetchDashboard";
import useFetchDatas from "../../../hooks/useFetchDatas";
import DashboardCard from "./DashboardCard";
import DashboardCardVisits from "./DashboardCardVisits";

const Dashboard = () => {
  const [sites] = useFetchDatas("/sites", "admin");
  const [rangeStartDobVisits, setRangeStartDobVisits] = useState(
    Date.parse(new Date(20, 0, 1))
  );
  const [rangeEndDobVisits, setRangeEndDobVisits] = useState(Date.now());
  const {
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
    billings,
    setBillings,
    rangeStartBillings,
    setRangeStartBillings,
    rangeEndBillings,
    setRangeEndBillings,
    loadingBillings,
    setLoadingBillings,
    errBillings,
    setErrBillings,
  } = useFetchDashboard();
  return (
    <div className="dashboard">
      <div className="dashboard-row">
        <DashboardCardVisits
          visits={visits}
          setVisits={setVisits}
          rangeStartVisits={rangeStartVisits}
          setRangeStartVisits={setRangeStartVisits}
          rangeEndVisits={rangeEndVisits}
          setRangeEndVisits={setRangeEndVisits}
          loadingVisits={loadingVisits}
          setLoadingVisits={setLoadingVisits}
          errVisits={errVisits}
          setErrVisits={setErrVisits}
          sites={sites}
        />
        {/* <DashboardCard title="Staff"></DashboardCard>
        <DashboardCard title="Appointments"></DashboardCard> */}
      </div>
      <div className="dashboard-row">
        <DashboardCard title="Billings"></DashboardCard>
        <DashboardCard title="Medications"></DashboardCard>
        <DashboardCard title="patients"></DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
