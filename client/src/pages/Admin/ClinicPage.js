import React from "react";
import { Helmet } from "react-helmet";
import Clinic from "../../components/Admin/Clinic/Clinic";

const ClinicPage = () => {
  return (
    <>
      <Helmet>
        <title>Manage clinic</title>
      </Helmet>
      <section className="clinic-section">
        <h2 className="clinic-section__title">Manage clinic</h2>
        <Clinic />
      </section>
    </>
  );
};

export default ClinicPage;
