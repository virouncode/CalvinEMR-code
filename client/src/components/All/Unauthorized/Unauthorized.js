import React from "react";
import { NavLink } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h2 className="unauthorized-container-title">
        Unauthorized Page : you don't have access to the requested page
      </h2>
      <p>Please contact an admin</p>
      <NavLink className="unauthorized-container-link" to="/login">
        Return to login page
      </NavLink>
    </div>
  );
};

export default Unauthorized;
