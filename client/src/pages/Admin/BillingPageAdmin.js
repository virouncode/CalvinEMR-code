import React from "react";
import { Helmet } from "react-helmet";
import BillingAdmin from "../../components/Admin/Billing/BillingAdmin";
import useTitle from "../../hooks/useTitle";

const BillingPageAdmin = () => {
  useTitle("Billings");
  return (
    <>
      <Helmet>
        <title>Billing</title>
      </Helmet>
      <section className="billing-section">
        <BillingAdmin />
      </section>
    </>
  );
};

export default BillingPageAdmin;
