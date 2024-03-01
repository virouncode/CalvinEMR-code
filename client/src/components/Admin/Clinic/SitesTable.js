import React from "react";
import EmptyRow from "../../All/UI/Tables/EmptyRow";
import LoadingRow from "../../All/UI/Tables/LoadingRow";
import SiteItem from "./SiteItem";

const SitesTable = ({ sites, loading, errMsg, handleEditClick }) => {
  return (
    <>
      {errMsg && <p className="sites__err">{errMsg}</p>}
      {!errMsg && (
        <div className="sites__table-container">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Site name</th>
                <th>Address</th>
                <th>City</th>
                <th>Province/State</th>
                <th>Postal/Zip code</th>
                <th>Phone</th>
                <th>Fax</th>
                <th>Logo</th>
                <th>Rooms list</th>
                <th>Updated by</th>
                <th>Updated on</th>
              </tr>
            </thead>
            <tbody>
              {sites && sites.length > 0
                ? sites.map((site) => (
                    <SiteItem
                      key={site.id}
                      site={site}
                      handleEditClick={handleEditClick}
                    />
                  ))
                : !loading && <EmptyRow colSpan="12" text="No clinic sites" />}
              {loading && <LoadingRow colSpan="12" />}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default SitesTable;
