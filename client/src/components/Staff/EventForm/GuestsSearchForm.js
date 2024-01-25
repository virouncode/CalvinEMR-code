import React from "react";

const GuestsSearchForm = ({ search, setSearch }) => {
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSearch({ ...search, [name]: value });
  };

  return (
    <div className="search-bar">
      <p className="search-bar-title">Search by</p>
      <div className="search-bar-row">
        <div className="search-bar-item">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={search.name}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="search-bar-item">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={search.email}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="search-bar-row">
        <div className="search-bar-item">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={search.phone}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="search-bar-item">
          <label>Date of birth</label>
          <input
            type="text"
            name="birth"
            value={search.birth}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="search-bar-row">
        <div className="search-bar-item">
          <label>Chart #</label>
          <input
            type="text"
            name="chart"
            value={search.chart}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="search-bar-item">
          <label>Social Insurance #</label>
          <input
            type="text"
            name="health"
            value={search.health}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};

export default GuestsSearchForm;
