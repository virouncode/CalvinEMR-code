import React from "react";
import { Helmet } from "react-helmet";
import SearchPatient from "../../components/Staff/Record/Search/SearchPatient";
import useTitle from "../../hooks/useTitle";

const StaffSearchPatientPage = () => {
  useTitle("Search Patient");
  return (
    <>
      <Helmet>
        <title>Patients</title>
      </Helmet>
      <section className="search-patient-section">
        <SearchPatient />
      </section>
    </>
  );
};

export default StaffSearchPatientPage;
