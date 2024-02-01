import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";

const StaffHeader = () => {
  const { user, setUser, setAuth, setClinic } = useAuth();
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
    <header className="header">
      <div className="header__logo" onClick={() => navigate("/")}></div>
      <nav className="header__nav">
        <ul>
          <li>
            <NavLink
              to="/staff/calendar"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              Calendar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/search-patient"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              Patient Search
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/signup-patient"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              New Patient
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/doc-inbox"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              Inbox
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/messages"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              {"Messages" + (user.unreadNbr ? ` (${user.unreadNbr})` : "")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/reference"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              Reference
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/calvinai"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              CalvinAI
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/billing"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
            >
              Billings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/my-account"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
              target="_blank"
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
                  ? "header__link header__link--active"
                  : "header__link"
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

export default StaffHeader;
