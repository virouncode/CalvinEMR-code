import React from "react";
import { Helmet } from "react-helmet";
import Dashboard from "../../components/Admin/Dashboard/Dashboard";
import useTitle from "../../hooks/useTitle";

const AdminDashboardPage = () => {
  useTitle("Dashboard");
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <section className="dashboard-section">
        <Dashboard />
      </section>
    </>
  );
};

export default AdminDashboardPage;
