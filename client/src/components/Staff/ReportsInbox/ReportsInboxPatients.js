import React, { useState } from "react";
import usePatientsDemographics from "../../../hooks/usePatientsDemographics";
import PatientsList from "../Messaging/PatientsList";
import ReportInboxPatientSearch from "./ReportInboxPatientSearch";

const ReportsInboxPatients = ({
  isPatientChecked,
  handleCheckPatient,
  label = true,
}) => {
  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 15,
    offset: 0,
  });
  const { loading, err, patientsDemographics, hasMore } =
    usePatientsDemographics(search, paging);

  const handleSearch = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setSearch({ ...search, [name]: value });
    setPaging({ ...paging, page: 1 });
  };
  return (
    <div className="reportsinbox__patients">
      {label && <div className="reportsinbox__patients-title">Patients</div>}
      <ReportInboxPatientSearch search={search} handleSearch={handleSearch} />
      <div className="reportsinbox__patients-list">
        <PatientsList
          isPatientChecked={isPatientChecked}
          handleCheckPatient={handleCheckPatient}
          patientsDemographics={patientsDemographics}
          loading={loading}
          hasMore={hasMore}
          setPaging={setPaging}
        />
      </div>
    </div>
  );
};

export default ReportsInboxPatients;
