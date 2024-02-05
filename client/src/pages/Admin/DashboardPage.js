import React from "react";
import { Helmet } from "react-helmet";
import Dashboard from "../../components/Admin/Dashboard/Dashboard";

const DashboardPage = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <section className="dashboard-section">
        <h2 className="dashboard-section__title">Dashboard</h2>
        <Dashboard />
      </section>
    </>
  );
};

export default DashboardPage;
