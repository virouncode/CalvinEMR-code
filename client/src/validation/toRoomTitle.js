export const toRoomTitle = (sites, siteId, roomId) => {
  if (!siteId || !roomId) return "";
  return sites
    .find(({ id }) => id === siteId)
    ?.rooms.find(({ id }) => id === roomId)?.title;
};
