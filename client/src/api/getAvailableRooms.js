import xanoGet from "./xanoCRUD/xanoGet";

var _ = require("lodash");

export const getAvailableRooms = async (
  currentAppointmentId,
  rangeStart,
  rangeEnd,
  sites,
  siteId,
  abortController = null
) => {
  try {
    const response = await xanoGet(
      "/appointments_in_range_and_sites",
      "staff",
      {
        range_start: rangeStart,
        range_end: rangeEnd,
        sites_ids: [siteId],
      },
      abortController
    );
    const appointmentsInRange = response?.data;
    const otherAppointments = appointmentsInRange.filter(
      ({ id }) => id !== currentAppointmentId
    );
    const occupiedRooms = _.uniq(
      otherAppointments
        .filter(({ room_id }) => room_id !== "z")
        .map(({ room_id }) => room_id)
    );
    const allRooms = sites
      .find(({ id }) => id === siteId)
      ?.rooms.filter(({ id }) => id !== "z")
      .map(({ id }) => id);
    const availableRooms = _.difference(allRooms, occupiedRooms);
    return availableRooms;
  } catch (err) {
    if (err.name !== "CanceledError") throw err;
  }
};
