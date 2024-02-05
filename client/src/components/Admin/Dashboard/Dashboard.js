import React from "react";
import DashboardCard from "./DashboardCard";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-row">
        <DashboardCard title="Patients"></DashboardCard>
        <DashboardCard title="Staff"></DashboardCard>
        <DashboardCard title="Appointments"></DashboardCard>
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
