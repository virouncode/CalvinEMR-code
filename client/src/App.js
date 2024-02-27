//Librairies
import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/All/UI/Layouts/AdminLayout";
import LoginLayout from "./components/All/UI/Layouts/LoginLayout";
import PatientLayout from "./components/All/UI/Layouts/PatientLayout";
import StaffLayout from "./components/All/UI/Layouts/StaffLayout";
import RequireAuth from "./context/RequireAuth";
import useAutoLogout from "./hooks/useAutoLogout";
import { useLocalStorageTracker } from "./hooks/useLocalStorageTracker";
import useLogoutForAll from "./hooks/useLogoutForAll";
import useSocketConfig from "./hooks/useSocketConfig";
import BillingPageAdmin from "./pages/Admin/BillingPageAdmin";
import ClinicPage from "./pages/Admin/ClinicPage";
import DashboardPage from "./pages/Admin/DashboardPage";
import MigrationPage from "./pages/Admin/MigrationPage";
import StaffAccountsPage from "./pages/Admin/StaffAccountsPage";
import LoginPage from "./pages/All/LoginPage";
import MissingPage from "./pages/All/MissingPage";
import ResetPage from "./pages/All/ResetPage";
import SuspendedPage from "./pages/All/SuspendedPage";
import UnauthorizedPage from "./pages/All/UnauthorizedPage";
import PatientAccountPage from "./pages/Patient/PatientAccountPage";
import PatientAppointmentsPage from "./pages/Patient/PatientAppointmentsPage";
import PatientCredentialsPage from "./pages/Patient/PatientCredentialsPage";
import PatientMessagesPage from "./pages/Patient/PatientMessagesPage";
import BillingPage from "./pages/Staff/BillingPage";
import CalendarPage from "./pages/Staff/CalendarPage";
import CalvinAIPage from "./pages/Staff/CalvinAIPage";
import CredentialsPage from "./pages/Staff/CredentialsPage";
import MessagesPage from "./pages/Staff/MessagesPage";
import MyAccountPage from "./pages/Staff/MyAccountPage";
import PatientRecordPage from "./pages/Staff/PatientRecordPage";
import ReferencePage from "./pages/Staff/ReferencePage";
import ReportsInboxPage from "./pages/Staff/ReportsInboxPage";
import SearchPatientPage from "./pages/Staff/SearchPatientPage";
import SignupPatientPage from "./pages/Staff/SignupPatientPage";

const App = () => {
  useLocalStorageTracker();
  useAutoLogout(120);
  useLogoutForAll(); //log every tabs out if logout on one tab
  useSocketConfig(false); //true for dev, false for prod

  return (
    <Routes>
      <Route path="/" element={<LoginLayout />}>
        {/* public routes */}
        <Route index element={<LoginPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="suspended" element={<SuspendedPage />} />
        <Route path="reset-password" element={<ResetPage />}></Route>
        {/* catch all */}
        <Route path="*" element={<MissingPage />} />
      </Route>
      <Route path="staff" element={<StaffLayout />}>
        {/* protected routes */}
        <Route element={<RequireAuth allowedAccesses={["User"]} />}>
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="search-patient" element={<SearchPatientPage />} />
          <Route path="patient-record/:id" element={<PatientRecordPage />} />
          <Route path="signup-patient" element={<SignupPatientPage />} />
          <Route path="reports-inbox" element={<ReportsInboxPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route
            path="messages/:messageId/:sectionName/:msgType"
            element={<MessagesPage />}
          />
          <Route path="reference" element={<ReferencePage />} />
          <Route path="calvinai" element={<CalvinAIPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route
            path="billing/:pid/:pName/:hcn/:date"
            element={<BillingPage />}
          />
          <Route path="my-account" element={<MyAccountPage />} />
          <Route path="credentials" element={<CredentialsPage />} />
          <Route path="export" element={<MigrationPage />} />
        </Route>
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        {/* protected routes */}
        <Route element={<RequireAuth allowedAccesses={["Admin"]} />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="staff-accounts" element={<StaffAccountsPage />} />
          <Route path="clinic" element={<ClinicPage />} />
          <Route path="billing" element={<BillingPageAdmin />} />
          <Route path="migration" element={<MigrationPage />} />
        </Route>
      </Route>
      <Route path="patient" element={<PatientLayout />}>
        {/* protected routes */}
        <Route element={<RequireAuth allowedAccesses={["Patient"]} />}>
          <Route path="messages" element={<PatientMessagesPage />} />
          <Route path="appointments" element={<PatientAppointmentsPage />} />
          <Route path="my-account" element={<PatientAccountPage />} />
          <Route path="credentials" element={<PatientCredentialsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
