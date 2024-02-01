import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";

const AdminHeader = () => {
  const { setUser, setAuth, setClinic } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    setAuth({});
    setUser({});
    setClinic({});
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("clinic");
    localStorage.removeItem("tabCounter");
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
              to="/admin/accounts"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              Accounts
            </NavLink>
          </li>
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
              target="_blank"
            >
              Billings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/rooms"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
              target="_blank"
            >
              Rooms
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
