import React from "react";
import { Helmet } from "react-helmet";
import StaffAccounts from "../../components/Admin/StaffAccounts/StaffAccounts";
import useTitle from "../../hooks/useTitle";

const AdminStaffAccountsPage = () => {
  useTitle("Manage staff accounts");
  return (
    <>
      <Helmet>
        <title>Manage staff accounts</title>
      </Helmet>
      <section className="accounts-section">
        <StaffAccounts />
      </section>
    </>
  );
};

export default AdminStaffAccountsPage;
