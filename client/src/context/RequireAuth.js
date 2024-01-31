import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuthStaff = ({ allowedAccesses }) => {
  const { auth, user } = useAuth();
  const location = useLocation();

  return allowedAccesses.includes(user.access_level) ? (
    //l'utilisateur a reussi à se connecter et a l'access level => on lui fourni ce qu'il y a à l'intérieur
    <Outlet />
  ) : auth?.email ? ( //si l'utilisateur a reussi à se connecter mais n'a pas l'access level
    <Navigate to="/unauthorized" state={{ from: location }} replace /> //il n'est pas autorisé
  ) : (
    <Navigate to="/login" state={{ from: location }} replace /> //il ne s'est pas encore connecté donc on le renvoie à la page de login et on enregistre là où il voulait aller pour le rediriger ensuite
  );
};
export default RequireAuthStaff;
