import React from "react";
import { Helmet } from "react-helmet";
import MyAccountStaff from "../../components/Staff/MyAccount/MyAccountStaff";
import useTitle from "../../hooks/useTitle";

const StaffMyAccountPage = () => {
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

export default StaffMyAccountPage;
