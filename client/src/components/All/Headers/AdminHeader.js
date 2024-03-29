import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAdminsInfosContext from "../../../hooks/context/useAdminsInfosContext";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";

const AdminHeader = () => {
  const { setUser } = useUserContext();
  const { setAuth } = useAuthContext();
  const { setStaffInfos } = useStaffInfosContext();
  const { setAdminsInfos } = useAdminsInfosContext();
  const { setClinic } = useClinicContext();
  const navigate = useNavigate();
  const handleLogout = () => {
    setAuth({});
    setUser({});
    setStaffInfos({});
    setAdminsInfos([]);
    setClinic({});
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("staffInfos");
    localStorage.removeItem("adminsInfos");
    localStorage.removeItem("clinic");
    localStorage.removeItem("lastAction");
    localStorage.setItem("message", "logout");
    localStorage.removeItem("message");
  };
  return (
    <header className="header header--admin">
      <div className="header__logo" onClick={() => navigate("/")}></div>
      <nav className="header__nav header__nav--admin">
        <ul>
          <li>
            <NavLink
              to="/admin/dashboard"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/staff-accounts"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              Staff Accounts
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/admin/patients-accounts"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              Patients Accounts
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="/admin/clinic"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              Clinic infos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/billing"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              Billings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/migration"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              Migration
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/my-account"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              My Account
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              onClick={handleLogout}
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              Log out
            </NavLink>
          </li>
        </ul>
      </nav>
      <h1 className="header__title">Electronic Medical Records</h1>
    </header>
  );
};

export default AdminHeader;
