import React, { useState } from "react";
import PatientsList from "./PatientsList";

const Patients = ({ isPatientChecked, handleCheckPatient, label = true }) => {
  const [search, setSearch] = useState("");
  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };
  return (
    <div className="patients">
      {label && <div className="patients__title">Related patient</div>}
      <div className="patients__search-input">
        <input
          type="text"
          value={search}
          placeholder="Search patient"
          onChange={handleChange}
        />
      </div>
      <div className="patients__list">
        <PatientsList
          isPatientChecked={isPatientChecked}
          handleCheckPatient={handleCheckPatient}
          search={search}
        />
      </div>
    </div>
  );
};

export default Patients;
