import React from "react";
import { Helmet } from "react-helmet";
import Billing from "../../components/Staff/Billing/Billing";
import useAuth from "../../hooks/useAuth";

const BillingPage = () => {
  const { user } = useAuth();
  return (
    <>
      <Helmet>
        <title>Billing</title>
      </Helmet>
      <section className="billing-section">
        <h2 className="billing-section__title">
          {user.title === "Secretary" ? "Billings" : "My billings"}
        </h2>
        <Billing />
      </section>
    </>
  );
};

export default BillingPage;
