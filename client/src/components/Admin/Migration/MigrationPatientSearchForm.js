import React from "react";

const MigrationPatientSearchForm = ({ search, handleSearch }) => {
  return (
    <div className="migration-export__patient-search">
      <form className="migration-export__patient-search__form">
        <div className="migration-export__patient-search__item">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={search.name}
            onChange={handleSearch}
            autoComplete="off"
            id="name"
            autoFocus
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={search.email}
            onChange={handleSearch}
            autoComplete="off"
            id="email"
          />
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            name="phone"
            value={search.phone}
            onChange={handleSearch}
            autoComplete="off"
            id="phone"
          />
        </div>
        <div className="migration-export__patient-search__item">
          <label htmlFor="birth">Date Of Birth</label>
          <input
            type="text"
            name="birth"
            value={search.birth}
            onChange={handleSearch}
            autoComplete="off"
            id="birth"
          />
          <label htmlFor="chart">Chart#</label>
          <input
            type="text"
            name="chart"
            value={search.chart}
            onChange={handleSearch}
            autoComplete="off"
            id="chart"
          />
          <label htmlFor="health">Health Card#</label>
          <input
            type="text"
            name="health"
            value={search.health}
            onChange={handleSearch}
            autoComplete="off"
            id="health"
          />
        </div>
      </form>
    </div>
  );
};

export default MigrationPatientSearchForm;
