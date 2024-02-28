import React from "react";
import { Helmet } from "react-helmet";
import MyAccountForm from "../../components/Staff/Account/MyAccountForm";
import useTitle from "../../hooks/useTitle";

const MyAccountPage = () => {
  useTitle("My personal informations");
  return (
    <>
      <Helmet>
        <title>My account</title>
      </Helmet>
      <section className="myaccount-section">
        <MyAccountForm />
      </section>
    </>
  );
};

export default MyAccountPage;
