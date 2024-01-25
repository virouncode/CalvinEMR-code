import React from "react";
import { Helmet } from "react-helmet";
import SearchPatient from "../../components/Staff/Record/Search/SearchPatient";

const SearchPatientPage = () => {
  return (
    <>
      <Helmet>
        <title>Patients</title>
      </Helmet>
      <section className="search-patient-section">
        <h2 className="search-patient-section__title">Search Patient</h2>
        <SearchPatient />
      </section>
    </>
  );
};

export default SearchPatientPage;
