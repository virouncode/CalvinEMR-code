import React from "react";
import { Helmet } from "react-helmet";
import ClinicInfos from "../../components/Admin/Clinic/ClinicInfos";
import useTitle from "../../hooks/useTitle";

const AdminClinicPage = () => {
  useTitle("Manage clinic");
  return (
    <>
      <Helmet>
        <title>Manage clinic</title>
      </Helmet>
      <section className="clinic-section">
        <ClinicInfos />
      </section>
    </>
  );
};

export default AdminClinicPage;
