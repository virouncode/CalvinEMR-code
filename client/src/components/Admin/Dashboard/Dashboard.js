import React, { useState } from "react";
import useFetchDashboard from "../../../hooks/useFetchDashboard";
import DashboardCard from "./DashboardCard";
import DashboardCardPatients from "./DashboardCardPatients";
import DashboardCardStaff from "./DashboardCardStaff";
import DashboardCardVisits from "./DashboardCardVisits";

const Dashboard = () => {
  const [rangeStartDobVisits, setRangeStartDobVisits] = useState(
    Date.parse(new Date(20, 0, 1))
  );
  const {
    visits,
    rangeStartVisits,
    setRangeStartVisits,
    rangeEndVisits,
    setRangeEndVisits,
    loadingVisits,
    errVisits,
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
    sites,
    loadingSites,
    errSites,
    patientsPerGender,
    loadingPatientsPerGender,
    errPatientsPerGender,
    patientsPerAge,
    loadingPatientsPerAge,
    errPatientsPerAge,
  } = useFetchDashboard();
  return (
    <div className="dashboard">
      <div className="dashboard-row">
        <DashboardCardVisits
          visits={visits}
          rangeStartVisits={rangeStartVisits}
          setRangeStartVisits={setRangeStartVisits}
          rangeEndVisits={rangeEndVisits}
          setRangeEndVisits={setRangeEndVisits}
          loadingVisits={loadingVisits}
          errVisits={errVisits}
          sites={sites}
        />
      </div>
      <div className="dashboard-row">
        <DashboardCardStaff
          sites={sites}
          loadingSites={loadingSites}
          errSites={errSites}
        />
      </div>
      <div className="dashboard-row">
        <DashboardCardPatients
          sites={sites}
          patientsPerGender={patientsPerGender}
          loadingPatientsPerGender={loadingPatientsPerGender}
          errPatientsPerGender={errPatientsPerGender}
          patientsPerAge={patientsPerAge}
          loadingPatientsPerAge={loadingPatientsPerAge}
          errPatientsPerAge={errPatientsPerAge}
        />
      </div>
      <div className="dashboard-row">
        <DashboardCard title="Billings"></DashboardCard>
      </div>
      <div className="dashboard-row">
        <DashboardCard title="Medications"></DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
