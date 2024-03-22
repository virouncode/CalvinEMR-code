import { useEffect, useState } from "react";

const useRevenues = (billings, sites) => {
  const [revenues, setRevenues] = useState([]);
  useEffect(() => {
    if (!sites || sites?.length === 0 || !billings || billings?.length === 0)
      return;
    let totalsBySite = [];

    for (const site of sites) {
      const billingsForSite = billings.filter(
        ({ site_id }) => site_id === site.id
      );
      const revenueForSite =
        billingsForSite.reduce(
          (acc, current) =>
            acc +
            current.billing_infos.anaesthetist_fee +
            current.billing_infos.assistant_fee +
            current.billing_infos.non_anaesthetist_fee +
            current.billing_infos.provider_fee +
            current.billing_infos.specialist_fee,
          0
        ) / 1000;
      totalsBySite = [...totalsBySite, { revenue: revenueForSite }];
    }
    const totals = {
      revenue: totalsBySite.reduce((acc, current) => acc + current.revenue, 0),
    };
    setRevenues([...totalsBySite, totals]);
  }, [billings, sites]);

  return { revenues };
};

export default useRevenues;
