import React from "react";
import { Helmet } from "react-helmet";
import MyAccountStaff from "../../components/Staff/Account/MyAccountStaff";
import useTitle from "../../hooks/useTitle";

const MyAccountPage = () => {
  useTitle("My personal informations");
  return (
    <>
      <Helmet>
        <title>My account</title>
      </Helmet>
      <section className="myaccount-section">
        <MyAccountStaff />
      </section>
    </>
  );
};

export default MyAccountPage;
