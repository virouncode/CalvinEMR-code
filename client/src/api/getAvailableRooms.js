import { axiosXanoStaff } from "./xanoStaff";
var _ = require("lodash");

export const getAvailableRooms = async (
  currentAppointmentId,
  rangeStart,
  rangeEnd,
  sites,
  siteId,
  authToken,
  controller = null
) => {
  try {
    const response = await axiosXanoStaff.post(
      "/appointments_in_range_and_sites",
      {
        range_start: rangeStart,
        range_end: rangeEnd,
        sites_ids: [siteId],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        ...(controller && { signal: controller.signal }),
      }
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
