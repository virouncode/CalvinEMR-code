import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuthPatient = ({ allowedAccesses }) => {
  const { auth, user } = useAuth();
  const location = useLocation();

  return allowedAccesses.includes(user.access_level) ? (
    <Outlet />
  ) : auth?.email ? (
    <Navigate to="/patient/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuthPatient;
