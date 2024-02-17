import React from "react";

const GuestsSearchForm = ({ search, handleSearch }) => {
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
            onChange={handleSearch}
            autoComplete="off"
          />
        </div>
        <div className="search-bar-item">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={search.email}
            onChange={handleSearch}
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
            onChange={handleSearch}
            autoComplete="off"
          />
        </div>
        <div className="search-bar-item">
          <label>Date of birth</label>
          <input
            type="text"
            name="birth"
            value={search.birth}
            onChange={handleSearch}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="search-bar-row">
        <div className="search-bar-item">
          <label>Chart#</label>
          <input
            type="text"
            name="chart"
            value={search.chart}
            onChange={handleSearch}
            autoComplete="off"
          />
        </div>
        <div className="search-bar-item">
          <label>Health Card#</label>
          <input
            type="text"
            name="health"
            value={search.health}
            onChange={handleSearch}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};

export default GuestsSearchForm;
