import React, { useState } from "react";
import useAllPatientsDemoSocket from "../../../../hooks/useAllPatientsDemoSocket";
import usePatientsDemographics from "../../../../hooks/usePatientsDemographics";
import PatientSearchForm from "./PatientSearchForm";
import PatientSearchResult from "./PatientSearchResult";

const SearchPatient = () => {
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 15,
    offset: 0,
  });
  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });
  const {
    loading,
    err,
    patientsDemographics,
    setPatientsDemographics,
    hasMore,
    totalPatients,
  } = usePatientsDemographics(search, paging);

  useAllPatientsDemoSocket(patientsDemographics, setPatientsDemographics);

  const handleSearch = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setSearch({ ...search, [name]: value });
    setPaging({ ...paging, page: 1 });
  };
  return (
    <>
      <PatientSearchForm search={search} handleSearch={handleSearch} />
      <PatientSearchResult
        search={search}
        patientsDemographics={patientsDemographics}
        err={err}
        loading={loading}
        hasMore={hasMore}
        setPaging={setPaging}
        totalPatients={totalPatients}
      />
    </>
  );
};

export default SearchPatient;
