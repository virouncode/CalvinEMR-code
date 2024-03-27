import { useEffect, useState } from "react";
import { topKFrequent } from "../utils/charts/topKFrequent";

const useTop10Meds = (medications, sites, siteSelectedIdMeds) => {
  const [top10Meds, setTop10Meds] = useState([]);
  useEffect(() => {
    if (
      !sites ||
      sites?.length === 0 ||
      !medications ||
      medications?.length === 0
    )
      return;
    let top10MedsForSite = [];

    const medsForSite = medications.filter(
      ({ site_id }) => site_id === siteSelectedIdMeds
    );
    if (medsForSite.length > 0) {
      const medsNamesForSite = medsForSite.map((med) => med.DrugName);
      top10MedsForSite = topKFrequent(medsNamesForSite, 10, "medication");
    } else {
      top10MedsForSite = [];
    }
    setTop10Meds(top10MedsForSite);
  }, [medications, siteSelectedIdMeds, sites]);
  return { top10Meds };
};

export default useTop10Meds;
