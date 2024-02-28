import React from "react";
import SiteItem from "./SiteItem";

const SitesTable = ({ sites, handleEditClick }) => {
  return (
    <div className="sites__table-container">
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Site name</th>
            <th>Address</th>
            <th>Postal code</th>
            <th>Province/State</th>
            <th>City</th>
            <th>Phone</th>
            <th>Fax</th>
            <th>Logo</th>
            <th>Rooms list</th>
            <th>Updated by</th>
            <th>Updated on</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <SiteItem
              key={site.id}
              site={site}
              handleEditClick={handleEditClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SitesTable;
