import React from "react";
import SelectSite from "../../Staff/EventForm/SelectSite";

const StaffAccountSearch = ({ search, setSearch, sites }) => {
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSearch({ ...search, [name]: value });
  };

  const handleSiteChange = (e) => {
    setSearch({ ...search, site_id: parseInt(e.target.value) });
  };
  return (
    <div className="staff-search">
      <form className="staff-search__form">
        <div className="staff-search__row">
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
            {" "}
            <SelectSite
              handleSiteChange={handleSiteChange}
              sites={sites}
              value={search.site_id}
              label={true}
              all={true}
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
        </div>
        <div className="staff-search__row">
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
          <div className="staff-search__item">
            <label htmlFor="speciality">Speciality</label>
            <input
              type="text"
              name="speciality"
              value={search.speciality}
              onChange={handleChange}
              autoComplete="off"
              id="speciality"
            />
          </div>
          <div className="staff-search__item">
            <label htmlFor="subspeciality">Subspeciality</label>
            <input
              type="text"
              name="subspeciality"
              value={search.subspeciality}
              onChange={handleChange}
              autoComplete="off"
              id="subspeciality"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default StaffAccountSearch;
