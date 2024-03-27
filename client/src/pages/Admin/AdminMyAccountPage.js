import React from "react";
import { Helmet } from "react-helmet";
import MyAccountAdmin from "../../components/Admin/MyAccount/MyAccountAdmin";
import useTitle from "../../hooks/useTitle";

const AdminMyAccountPage = () => {
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

export default AdminMyAccountPage;
