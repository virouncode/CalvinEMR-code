import React from "react";
import { Helmet } from "react-helmet";
import Billing from "../../components/Staff/Billing/Billing";
import useUserContext from "../../hooks/context/useUserContext";
import useTitle from "../../hooks/useTitle";

const StaffBillingPage = () => {
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

export default StaffBillingPage;
