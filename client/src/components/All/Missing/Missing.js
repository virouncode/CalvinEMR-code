import React from "react";
import { NavLink } from "react-router-dom";

const Missing = () => {
  return (
    <div className="missing-container">
      <h2 className="missing-container-title">Page not found</h2>
      <NavLink to="/login" className="missing-container-link">
        Return to the login page
      </NavLink>
    </div>
  );
};

export default Missing;
