import React from "react";

const SitesCheckboxes = ({ sites, sitesIds, setSitesIds }) => {
  const handleCheckAllSitesIds = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setSitesIds(sites.map(({ id }) => id));
    } else {
      setSitesIds([]);
    }
  };
  const handleCheckSiteId = (e, siteId) => {
    const checked = e.target.checked;
    if (checked) {
      setSitesIds([...sitesIds, siteId]);
    } else {
      setSitesIds(sitesIds.filter((id) => id !== siteId));
    }
  };
  const isSiteIdChecked = (siteId) => {
    return sitesIds.includes(siteId);
  };
  const isAllSitesIdsChecked = () => {
    return sitesIds.length === sites.length ? true : false;
  };

  return (
    sites && (
      <ul className="site-checkboxes">
        <li className="site-checkboxes__title">
          <input
            type="checkbox"
            id="sites"
            onChange={handleCheckAllSitesIds}
            checked={isAllSitesIdsChecked()}
          />
          <label htmlFor="sites">Sites</label>
        </li>
        {sites.map((site) => (
          <li key={site.id} className="site-checkboxes__item">
            <input
              type="checkbox"
              id={site.id}
              onChange={(e) => handleCheckSiteId(e, site.id)}
              checked={isSiteIdChecked(site.id)}
            />
            <label htmlFor={site.id}>{site.name}</label>
          </li>
        ))}
      </ul>
    )
  );
};

export default SitesCheckboxes;
