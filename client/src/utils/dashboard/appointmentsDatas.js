import { axiosXanoAdmin } from "../../api/xanoAdmin";

export const getNbrOfAppointmentsInRange = async (
  range_start,
  range_end,
  authToken
) => {
  const response = await axiosXanoAdmin.post(
    "/appointments_in_range",
    { range_start, range_end },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return response.data.length;
};

export const roomOccupationInRange = async (
  roomName,
  range_start,
  range_end,
  authToken
) => {
  const appointmentsInRange = (
    await axiosXanoAdmin.post(
      "/appointments_in_range",
      { range_start, range_end },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
  ).data;

  return appointmentsInRange.filter(({ room }) => room === roomName).length;
};
