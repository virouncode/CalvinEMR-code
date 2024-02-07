import React from "react";
import { Helmet } from "react-helmet";
import BillingAdmin from "../../components/Admin/Billing/BillingAdmin";

const BillingPageAdmin = () => {
  return (
    <>
      <Helmet>
        <title>Billing</title>
      </Helmet>
      <section className="billing-section">
        <h2 className="billing-section__title">Billings</h2>
        <BillingAdmin />
      </section>
    </>
  );
};

export default BillingPageAdmin;
