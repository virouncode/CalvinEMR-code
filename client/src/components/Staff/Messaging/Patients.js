import React, { useState } from "react";
import usePatientsList from "../../../hooks/usePatientsList";
import PatientsList from "./PatientsList";

const Patients = ({
  isPatientChecked,
  handleCheckPatient,
  label = true,
  msgType,
}) => {
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 15,
    offset: 0,
  });
  const [search, setSearch] = useState("");
  const { loading, err, patientsDemographics, hasMore } = usePatientsList(
    search,
    paging
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setPaging({ ...paging, page: 1 });
    setSearch(value);
  };
  return (
    <div className="patients">
      {label && (
        <div className="patients__title">
          {msgType === "Internal" ? "Related patient" : "Recipient"}
        </div>
      )}
      <div className="patients__search-input">
        <input
          type="text"
          value={search}
          placeholder="Name, Email, Chart#, Health Card#,..."
          onChange={handleChange}
        />
      </div>
      <div className="patients__list">
        {err & <p className="patients__list-err">{err}</p>}
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

export default Patients;
