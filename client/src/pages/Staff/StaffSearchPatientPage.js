import React from "react";
import { Helmet } from "react-helmet";
import PatientSearch from "../../components/Staff/Record/Search/PatientSearch";
import useTitle from "../../hooks/useTitle";

const StaffSearchPatientPage = () => {
  useTitle("Search Patient");
  return (
    <>
      <Helmet>
        <title>Patients</title>
      </Helmet>
      <section className="search-patient-section">
        <PatientSearch />
      </section>
    </>
  );
};

export default StaffSearchPatientPage;
