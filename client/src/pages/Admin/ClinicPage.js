import React from "react";
import { Helmet } from "react-helmet";
import Clinic from "../../components/Admin/Clinic/Clinic";
import useTitle from "../../hooks/useTitle";

const ClinicPage = () => {
  useTitle("Manage clinic");
  return (
    <>
      <Helmet>
        <title>Manage clinic</title>
      </Helmet>
      <section className="clinic-section">
        <Clinic />
      </section>
    </>
  );
};

export default ClinicPage;
