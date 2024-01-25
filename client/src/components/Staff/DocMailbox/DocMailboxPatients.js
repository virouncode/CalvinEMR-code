import React, { useState } from "react";
import PatientsList from "../Messaging/PatientsList";

const DocMailboxPatients = ({
  isPatientChecked,
  handleCheckPatient,
  label = true,
}) => {
  const [search, setSearch] = useState("");
  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };
  return (
    <div className="docmailbox__patients">
      {label && <div className="docmailbox__patients-title">Patients</div>}
      <input
        type="text"
        value={search}
        placeholder="Search patient by name, phone, chart nbr, etc..."
        onChange={handleChange}
      />

      <div className="docmailbox__patients-list">
        <PatientsList
          isPatientChecked={isPatientChecked}
          handleCheckPatient={handleCheckPatient}
          search={search}
        />
      </div>
    </div>
  );
};

export default DocMailboxPatients;
