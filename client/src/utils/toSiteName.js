export const toSiteName = (sites, siteId) => {
  if (!siteId || !sites.length) return "";
  return sites.find(({ id }) => id === siteId)?.name || "";
};
