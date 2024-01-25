//Librairies
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import AdminLayout from "./components/All/UI/Layouts/AdminLayout";
import LoginLayout from "./components/All/UI/Layouts/LoginLayout";
import PatientLayout from "./components/All/UI/Layouts/PatientLayout";
import StaffLayout from "./components/All/UI/Layouts/StaffLayout";
import RequireAuth from "./context/RequireAuth";
import RequireAuthAdmin from "./context/RequireAuthAdmin";
import RequireAuthPatient from "./context/RequireAuthPatient";
import useAuth from "./hooks/useAuth";
import useAutoLogout from "./hooks/useAutoLogout";
import { useLocalStorageTracker } from "./hooks/useLocalStorageTracker";
import AccountsPage from "./pages/Admin/AccountsPage";
import DashboardPage from "./pages/Admin/DashboardPage";
import {
  default as ExportPage,
  default as MigrationPage,
} from "./pages/Admin/MigrationPage";
import LoginPage from "./pages/All/LoginPage";
import MissingPage from "./pages/All/MissingPage";
import ResetPage from "./pages/All/ResetPage";
import UnauthorizedPage from "./pages/All/UnauthorizedPage";
import PatientAccountPage from "./pages/Patient/PatientAccountPage";
import PatientAppointmentsPage from "./pages/Patient/PatientAppointmentsPage";
import PatientCredentialsPage from "./pages/Patient/PatientCredentialsPage";
import PatientMessagesPage from "./pages/Patient/PatientMessagesPage";
import BillingPage from "./pages/Staff/BillingPage";
import CalendarPage from "./pages/Staff/CalendarPage";
import CalvinAIPage from "./pages/Staff/CalvinAIPage";
import CredentialsPage from "./pages/Staff/CredentialsPage";
import DocMailboxPage from "./pages/Staff/DocMailboxPage";
import MessagesPage from "./pages/Staff/MessagesPage";
import MyAccountPage from "./pages/Staff/MyAccountPage";
import PatientRecordPage from "./pages/Staff/PatientRecordPage";
import ReferencePage from "./pages/Staff/ReferencePage";
import SearchPatientPage from "./pages/Staff/SearchPatientPage";
import SignupPatientPage from "./pages/Staff/SignupPatientPage";
import { onMessageClinic } from "./utils/socketHandlers/onMessageClinic";
import { onMessageUnread } from "./utils/socketHandlers/onMessageUnread";

const App = () => {
  useLocalStorageTracker();
  const navigate = useNavigate();
  const { user, setUser, setClinic, setAuth, setSocket, socket, clinic } =
    useAuth();

  const logout = () => {
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
  useAutoLogout(logout, 120);

  useEffect(() => {
    const storageListener = (e) => {
      if (e.key !== "message") return;
      const message = e.newValue;
      if (!message) return;
      if (message === "logout") {
        setUser({});
        setClinic({});
        setAuth({});
        navigate("/");
      }
    };
    window.addEventListener("storage", storageListener);
    return () => {
      window.removeEventListener("storage", storageListener);
    };
  }, [navigate, setAuth, setClinic, setSocket, setUser]);

  useEffect(() => {
    const socket = socketIOClient("http://localhost:3000");
    // const socket = socketIOClient(
    //   "https://fierce-retreat-45158-56541fefe81e.herokuapp.com/"
    // );
    setSocket(socket);
    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) => onMessageClinic(message, clinic, setClinic);
    const onMessage2 = (message) => onMessageUnread(message, user, setUser);
    socket.on("message", onMessage);
    socket.on("message", onMessage2);
    return () => {
      socket.off("message", onMessage);
      socket.off("message", onMessage2);
    };
  }, [clinic, setClinic, setUser, socket, user]);

  return (
    <Routes>
      <Route path="/" element={<LoginLayout />}>
        {/* public routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="reset-password" element={<ResetPage />}></Route>
        {/* catch all */}
        <Route path="*" element={<MissingPage />} />
      </Route>
      <Route path="/" element={<StaffLayout />}>
        {/* public routes */}
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        {/* protected routes */}
        <Route element={<RequireAuth allowedAccesses={["User"]} />}>
          <Route index element={<CalendarPage />} />
          <Route path="search-patient" element={<SearchPatientPage />} />
          <Route path="patient-record/:id" element={<PatientRecordPage />} />
          <Route path="signup-patient" element={<SignupPatientPage />} />
          <Route path="doc-inbox" element={<DocMailboxPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route
            path="messages/:messageId/:sectionName/:msgType"
            element={<MessagesPage />}
          />
          <Route path="reference" element={<ReferencePage />} />
          <Route path="calvinai" element={<CalvinAIPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="billing/:sin/:date" element={<BillingPage />} />
          <Route path="my-account" element={<MyAccountPage />} />
          <Route path="credentials" element={<CredentialsPage />} />
          <Route path="export" element={<ExportPage />} />
        </Route>
      </Route>
      <Route path="/" element={<AdminLayout />}>
        {/* protected routes */}
        <Route element={<RequireAuthAdmin allowedAccesses={["Admin"]} />}>
          <Route path="admin/dashboard" element={<DashboardPage />} />
          <Route path="admin/accounts" element={<AccountsPage />} />
          <Route path="admin/migration" element={<MigrationPage />} />
        </Route>
      </Route>
      <Route path="/" element={<PatientLayout />}>
        {/* protected routes */}
        <Route element={<RequireAuthPatient allowedAccesses={["Patient"]} />}>
          <Route path="patient/messages" element={<PatientMessagesPage />} />
          <Route
            path="patient/appointments"
            element={<PatientAppointmentsPage />}
          />
          <Route path="patient/my-account" element={<PatientAccountPage />} />
          <Route
            path="patient/credentials"
            element={<PatientCredentialsPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
