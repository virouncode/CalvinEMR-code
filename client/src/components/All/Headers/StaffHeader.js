import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAdminsInfosContext from "../../../hooks/context/useAdminsInfosContext";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";

const StaffHeader = () => {
  const { user, setUser } = useUserContext();
  const { setAuth } = useAuthContext();
  const { setStaffInfos } = useStaffInfosContext();
  const { setClinic } = useClinicContext();
  const { setAdminsInfos } = useAdminsInfosContext();

  const navigate = useNavigate();
  const handleLogout = () => {
    setAuth({});
    setUser({});
    setStaffInfos({});
    setAdminsInfos({});
    setClinic({});
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("staffInfos");
    localStorage.removeItem("adminsInfos");
    localStorage.removeItem("clinic");
    localStorage.removeItem("lastAction");
    localStorage.removeItem("currentClinicalNote");
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
            >
              Patients
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
            >
              New Patient
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/reports-inbox"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
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
