import React from "react";

const SelectSite = ({ handleChangeSite, sites, value, label = true }) => {
  return (
    <>
      {label && (
        <label style={{ fontWeight: "bold", marginRight: "10px" }}>Site</label>
      )}
      <select value={value} onChange={handleChangeSite}>
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
