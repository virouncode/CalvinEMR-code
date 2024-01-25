import React from "react";
import { Helmet } from "react-helmet";
import StaffAccounts from "../../components/Admin/StaffAccounts";

const AccountsPage = () => {
  return (
    <>
      <Helmet>
        <title>Manage accounts</title>
      </Helmet>
      <section className="accounts-section">
        <h2 className="accounts-section__title">Manage accounts</h2>
        <StaffAccounts />
      </section>
    </>
  );
};

export default AccountsPage;
