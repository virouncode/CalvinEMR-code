import { axiosXanoAdmin } from "../../api/xanoAdmin";

export const getEarningsInRange = async (range_start, range_end, authToken) => {
  const response = await axiosXanoAdmin.post(
    "/billings_in_range",
    { range_start, range_end },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  const earnings = response.data.reduce(
    (acc, curr) =>
      acc +
      curr.billing_code.provider_fee +
      curr.billing_code.assistant_fee +
      curr.billing_code.specialist_fee +
      curr.billing_code.anaesthetist_fee +
      curr.billing_code.non_anaesthetist_fee
  );
  return earnings;
};
