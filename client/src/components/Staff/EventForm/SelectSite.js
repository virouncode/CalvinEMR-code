import React from "react";

const SelectSite = ({
  handleSiteChange,
  sites,
  value,
  label = true,
  all = false,
}) => {
  return (
    <>
      {label && (
        <label style={{ fontWeight: "bold", marginRight: "10px" }}>Site </label>
      )}
      <select value={value} onChange={handleSiteChange}>
        {all && <option value="-1">All</option>}
        {/* <option value="0" disabled>
          Choose a site...
        </option> */}
        {sites &&
          sites.map((site) => (
            <option value={site.id} name={site.id} key={site.id}>
              {site.name}
            </option>
          ))}
      </select>
    </>
  );
};

export default SelectSite;
