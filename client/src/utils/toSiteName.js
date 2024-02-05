export const toSiteName = (sites, siteId) => {
  if (!siteId) return "";
  return sites.find(({ id }) => id === siteId)?.name || "";
};
