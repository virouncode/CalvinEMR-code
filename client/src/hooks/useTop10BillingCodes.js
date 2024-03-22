import { useEffect, useState } from "react";
import { topKFrequent } from "../utils/topKFrequent";

const useTop10BillingCodes = (billings, sites) => {
  const [top10BillingCodes, setTop10BillingCodes] = useState([]);

  useEffect(() => {
    if (!sites || sites?.length === 0 || !billings || billings?.length === 0)
      return;
    let totalsBySite = [];
    for (const site of sites) {
      const billingsForSite = billings.filter(
        ({ site_id }) => site_id === site.id
      );
      if (billingsForSite.length > 0) {
        const billingCodesForSite = billingsForSite.map(
          ({ billing_infos }) => billing_infos.billing_code
        );
        console.log("billing codes for site", billingCodesForSite);
        const top10BillingCodesForSite = topKFrequent(billingCodesForSite, 10);
        totalsBySite = [...totalsBySite, top10BillingCodesForSite];
      } else {
        totalsBySite = [...totalsBySite, {}];
      }
    }
    setTop10BillingCodes(totalsBySite);
  }, [billings, sites]);
  return { top10BillingCodes };
};

export default useTop10BillingCodes;
