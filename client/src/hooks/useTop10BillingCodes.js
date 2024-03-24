import { useEffect, useState } from "react";
import { topKFrequent } from "../utils/topKFrequent";

const useTop10BillingCodes = (billings, sites, siteSelectedId) => {
  const [top10BillingCodes, setTop10BillingCodes] = useState([]);

  useEffect(() => {
    if (!sites || sites?.length === 0 || !billings || billings?.length === 0)
      return;
    let top10BillingCodesForSite = [];

    const billingsForSite = billings.filter(
      ({ site_id }) => site_id === siteSelectedId
    );
    if (billingsForSite.length > 0) {
      const billingCodesForSite = billingsForSite.map(
        ({ billing_infos }) => billing_infos.billing_code
      );
      top10BillingCodesForSite = topKFrequent(
        billingCodesForSite,
        10,
        "billing_code"
      );
    } else {
      top10BillingCodesForSite = [];
    }

    setTop10BillingCodes(top10BillingCodesForSite);
  }, [billings, siteSelectedId, sites]);
  return { top10BillingCodes };
};

export default useTop10BillingCodes;
