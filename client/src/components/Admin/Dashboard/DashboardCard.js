import React from "react";

const DashboardCard = ({ title }) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card__title">{title}</div>
      <div className="dashboard-card__content"></div>
    </div>
  );
};

export default DashboardCard;
