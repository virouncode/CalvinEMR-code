import React from "react";
import { Helmet } from "react-helmet";
import StaffAccounts from "../../components/Admin/StaffAccounts/StaffAccounts";

const StaffAccountsPage = () => {
  return (
    <>
      <Helmet>
        <title>Manage staff accounts</title>
      </Helmet>
      <section className="accounts-section">
        <h2 className="accounts-section__title">Manage staff accounts</h2>
        <StaffAccounts />
      </section>
    </>
  );
};

export default StaffAccountsPage;
