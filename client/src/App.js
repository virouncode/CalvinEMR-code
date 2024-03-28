//Librairies
import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/All/Layouts/AdminLayout";
import LoginLayout from "./components/All/Layouts/LoginLayout";
import PatientLayout from "./components/All/Layouts/PatientLayout";
import StaffLayout from "./components/All/Layouts/StaffLayout";
import RequireAuth from "./context/RequireAuth";
import useAdminsInfosSocket from "./hooks/socket/useAdminsInfosSocket";
import useClinicSocket from "./hooks/socket/useClinicSocket";
import useStaffInfosSocket from "./hooks/socket/useStaffInfosSocket";
import useUnreadExternalSocket from "./hooks/socket/useUnreadExternalSocket";
import useUnreadSocket from "./hooks/socket/useUnreadSocket";
import useUserSocket from "./hooks/socket/useUserSocket";
import useAutoLogout from "./hooks/useAutoLogout";
import { useLocalStorageTracker } from "./hooks/useLocalStorageTracker";
import useLogoutForAll from "./hooks/useLogoutForAll";
import useSocketConfig from "./hooks/useSocketConfig";
import AdminBillingPage from "./pages/Admin/AdminBillingPage";
import AdminClinicPage from "./pages/Admin/AdminClinicPage";
import AdminCredentialsPage from "./pages/Admin/AdminCredentialsPage";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import AdminMigrationPage from "./pages/Admin/AdminMigrationPage";
import AdminMyAccountPage from "./pages/Admin/AdminMyAccountPage";
import AdminStaffAccountsPage from "./pages/Admin/AdminStaffAccountsPage";
import LoginPage from "./pages/All/LoginPage";
import MissingPage from "./pages/All/MissingPage";
import ResetPage from "./pages/All/ResetPage";
import SuspendedPage from "./pages/All/SuspendedPage";
import UnauthorizedPage from "./pages/All/UnauthorizedPage";
import PatientAppointmentsPage from "./pages/Patient/PatientAppointmentsPage";
import PatientCredentialsPage from "./pages/Patient/PatientCredentialsPage";
import PatientMessagesPage from "./pages/Patient/PatientMessagesPage";
import PatientMyAccountPage from "./pages/Patient/PatientMyAccountPage";
import StaffBillingPage from "./pages/Staff/StaffBillingPage";
import StaffCalendarPage from "./pages/Staff/StaffCalendarPage";
import StaffCalvinAIPage from "./pages/Staff/StaffCalvinAIPage";
import StaffCredentialsPage from "./pages/Staff/StaffCredentialsPage";
import StaffMessagesPage from "./pages/Staff/StaffMessagesPage";
import StaffMyAccountPage from "./pages/Staff/StaffMyAccountPage";
import StaffPatientRecordPage from "./pages/Staff/StaffPatientRecordPage";
import StaffReferencePage from "./pages/Staff/StaffReferencePage";
import StaffReportsInboxPage from "./pages/Staff/StaffReportsInboxPage";
import StaffSearchPatientPage from "./pages/Staff/StaffSearchPatientPage";
import StaffSignupPatientPage from "./pages/Staff/StaffSignupPatientPage";

const App = () => {
  useLocalStorageTracker();
  useAutoLogout(120); //autologout in x min
  useLogoutForAll(); //log every tabs out if logout on one tab
  useSocketConfig(true); //true for dev, false for prod
  useStaffInfosSocket();
  useAdminsInfosSocket();
  useUserSocket();
  useClinicSocket();
  useUnreadExternalSocket(); //for staff and patient
  useUnreadSocket(); //for staff

  return (
    <>
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
          <Route element={<RequireAuth allowedAccesses={["Staff"]} />}>
            <Route path="calendar" element={<StaffCalendarPage />} />
            <Route path="search-patient" element={<StaffSearchPatientPage />} />
            <Route
              path="patient-record/:id"
              element={<StaffPatientRecordPage />}
            />
            <Route path="signup-patient" element={<StaffSignupPatientPage />} />
            <Route path="reports-inbox" element={<StaffReportsInboxPage />} />
            <Route path="messages" element={<StaffMessagesPage />} />
            <Route
              path="messages/:messageId/:sectionName/:msgType"
              element={<StaffMessagesPage />}
            />
            <Route path="reference" element={<StaffReferencePage />} />
            <Route path="calvinai" element={<StaffCalvinAIPage />} />
            <Route path="billing" element={<StaffBillingPage />} />
            <Route
              path="billing/:pid/:pName/:hcn/:date"
              element={<StaffBillingPage />}
            />
            <Route path="my-account" element={<StaffMyAccountPage />} />
            <Route path="credentials" element={<StaffCredentialsPage />} />
          </Route>
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          {/* protected routes */}
          <Route element={<RequireAuth allowedAccesses={["Admin"]} />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="staff-accounts" element={<AdminStaffAccountsPage />} />
            <Route path="clinic" element={<AdminClinicPage />} />
            <Route path="billing" element={<AdminBillingPage />} />
            <Route path="migration" element={<AdminMigrationPage />} />
            <Route path="my-account" element={<AdminMyAccountPage />} />
            <Route path="credentials" element={<AdminCredentialsPage />} />
          </Route>
        </Route>
        <Route path="patient" element={<PatientLayout />}>
          {/* protected routes */}
          <Route element={<RequireAuth allowedAccesses={["Patient"]} />}>
            <Route path="messages" element={<PatientMessagesPage />} />
            <Route path="appointments" element={<PatientAppointmentsPage />} />
            <Route path="my-account" element={<PatientMyAccountPage />} />
            <Route path="credentials" element={<PatientCredentialsPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
