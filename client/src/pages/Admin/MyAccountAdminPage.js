import React from "react";
import { Helmet } from "react-helmet";
import MyAccountAdmin from "../../components/Admin/AccountAdmin/MyAccountAdmin";
import useTitle from "../../hooks/useTitle";

const MyAccountAdminPage = () => {
  useTitle("My personal informations");
  return (
    <>
      <Helmet>
        <title>My account</title>
      </Helmet>
      <section className="myaccount-section">
        <MyAccountAdmin />
      </section>
    </>
  );
};

export default MyAccountAdminPage;
