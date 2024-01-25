import React from "react";

const StaffSearchForm = ({ search, setSearch }) => {
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSearch({ ...search, [name]: value });
  };
  return (
    <div className="staff-search">
      <div className="staff-search__title">Search by</div>
      <form className="staff-search__form">
        <div className="staff-search__item">
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
        <div className="staff-search__item">
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
        <div className="staff-search__item">
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
        <div className="staff-search__item">
          <label htmlFor="title">Occupation</label>
          <input
            type="text"
            name="title"
            value={search.title}
            onChange={handleChange}
            autoComplete="off"
            id="title"
          />
        </div>
        <div className="staff-search__item">
          <label htmlFor="licence_nbr">Licence#</label>
          <input
            type="text"
            name="licence_nbr"
            value={search.licence_nbr}
            onChange={handleChange}
            autoComplete="off"
            id="licence_nbr"
          />
        </div>
        <div className="staff-search__item">
          <label htmlFor="ohip_billing_nbr">OHIP#</label>
          <input
            type="text"
            name="ohip_billing_nbr"
            value={search.ohip_billing_nbr}
            onChange={handleChange}
            autoComplete="off"
            id="ohip_billing_nbr"
          />
        </div>
      </form>
    </div>
  );
};

export default StaffSearchForm;
