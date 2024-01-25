import React from "react";
import { Helmet } from "react-helmet";
import ForgotPassword from "../../components/All/ResetPassword/ForgotPassword";

const ResetPage = () => {
  return (
    <>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>
      <section className="reset-section">
        <ForgotPassword />
      </section>
    </>
  );
};

export default ResetPage;
