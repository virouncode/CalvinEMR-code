import React from "react";
import { Helmet } from "react-helmet";
import Billing from "../../components/Staff/Billing/Billing";
import useTitle from "../../hooks/useTitle";

const BillingPageAdmin = () => {
  useTitle("Billings");
  return (
    <>
      <Helmet>
        <title>Billing</title>
      </Helmet>
      <section className="billing-section">
        <Billing />
      </section>
    </>
  );
};

export default BillingPageAdmin;
