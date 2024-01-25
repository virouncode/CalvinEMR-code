import React from "react";
import { Helmet } from "react-helmet";
import MyAccountForm from "../../components/Staff/Account/MyAccountForm";

const MyAccountPage = () => {
  return (
    <>
      <Helmet>
        <title>My account</title>
      </Helmet>
      <section className="myaccount-section">
        <h2 className="myaccount-section__title">My personal informations</h2>
        <MyAccountForm />
      </section>
    </>
  );
};

export default MyAccountPage;
