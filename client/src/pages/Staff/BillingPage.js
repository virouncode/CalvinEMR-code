import React from "react";
import { Helmet } from "react-helmet";
import Billing from "../../components/Staff/Billing/Billing";
import useTitle from "../../hooks/useTitle";
import useUserContext from "../../hooks/useUserContext";

const BillingPage = () => {
  const { user } = useUserContext();
  useTitle(user.title === "Secretary" ? "Billings" : "My billings");
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

export default BillingPage;
