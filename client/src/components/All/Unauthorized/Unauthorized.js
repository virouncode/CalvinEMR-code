import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Unauthorized = () => {
  const location = useLocation();
  return (
    <div className="unauthorized-container">
      <h2 className="unauthorized-container-title">
        Unauthorized Page : you don't have access to the requested page (
        {location.state?.from?.pathname})
      </h2>
      <p>Please contact an admin</p>
      <NavLink className="unauthorized-container-link" to="/">
        Return to login page
      </NavLink>
    </div>
  );
};

export default Unauthorized;
