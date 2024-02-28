//Librairies
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthContext from "../../../../hooks/useAuthContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";

const PatientHeader = () => {
  const { user, setUser } = useUserContext();
  const { setAuth } = useAuthContext();
  const { setStaffInfos } = useStaffInfosContext();
  const navigate = useNavigate();
  const handleLogout = () => {
    setAuth({});
    setUser({});
    setStaffInfos({});
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("staffInfos");
    localStorage.removeItem("tabCounter");
    localStorage.removeItem("lastAction");
    localStorage.setItem("message", "logout");
    localStorage.removeItem("message");
  };
  return (
    <header className="header header--patient">
      <div
        className="header__logo"
        onClick={() => navigate("/patient/messages")}
      ></div>
      <nav className="header__nav header__nav--patient">
        <ul>
          <li>
            <NavLink
              to="/patient/messages"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--patient header__link--active"
                  : "header__link header__link--patient"
              }
            >
              {"Messages" + (user.unreadNbr ? ` (${user.unreadNbr})` : "")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient/appointments"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--patient header__link--active"
                  : "header__link header__link--patient"
              }
            >
              Appointments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient/my-account"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--patient header__link--active"
                  : "header__link header__link--patient"
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
                  ? "header__link header__link--patient header__link--active"
                  : "header__link header__link--patient"
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

export default PatientHeader;
