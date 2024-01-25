import React from "react";

const AddressesList = ({ handleSiteChange, siteSelectedId, sites }) => {
  return (
    <select
      onChange={handleSiteChange}
      style={{ marginLeft: "10px" }}
      value={siteSelectedId}
    >
      <option value="" disabled selected>
        Choose an address...
      </option>
      {sites.map((site) => (
        <option key={site.id} value={site.id}>
          {site.name}
        </option>
      ))}
    </select>
  );
};

export default AddressesList;
