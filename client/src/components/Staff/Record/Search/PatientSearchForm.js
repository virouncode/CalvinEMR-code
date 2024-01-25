import React from "react";

const PatientSearchForm = ({ search, setSearch }) => {
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSearch({ ...search, [name]: value });
  };
  return (
    <div className="patient-search">
      <form className="patient-search__form">
        <div className="patient-search__item">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={search.name}
            onChange={handleChange}
            autoComplete="off"
            id="name"
            autoFocus
          />
        </div>
        <div className="patient-search__item">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={search.email}
            onChange={handleChange}
            autoComplete="off"
            id="email"
          />
        </div>
        <div className="patient-search__item">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            name="phone"
            value={search.phone}
            onChange={handleChange}
            autoComplete="off"
            id="phone"
          />
        </div>
        <div className="patient-search__item">
          <label htmlFor="birth">Date Of Birth</label>
          <input
            type="text"
            name="birth"
            value={search.birth}
            onChange={handleChange}
            autoComplete="off"
            id="birth"
          />
        </div>
        <div className="patient-search__item">
          <label htmlFor="chart">Chart#</label>
          <input
            type="text"
            name="chart"
            value={search.chart}
            onChange={handleChange}
            autoComplete="off"
            id="chart"
          />
        </div>
        <div className="patient-search__item">
          <label htmlFor="health">Social Insurance#</label>
          <input
            type="text"
            name="health"
            value={search.health}
            onChange={handleChange}
            autoComplete="off"
            id="health"
          />
        </div>
      </form>
    </div>
  );
};

export default PatientSearchForm;
