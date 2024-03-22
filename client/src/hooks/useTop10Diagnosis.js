import { useEffect, useState } from "react";
import { topKFrequent } from "../utils/topKFrequent";

const useTop10Diagnosis = (billings, sites) => {
  const [top10Diagnosis, setTop10Diagnosis] = useState([]);

  useEffect(() => {
    if (!sites || sites?.length === 0 || !billings || billings?.length === 0)
      return;
    let totalsBySite = [];
    for (const site of sites) {
      const billingsForSite = billings.filter(
        ({ site_id }) => site_id === site.id
      );
      if (billingsForSite.length > 0) {
        const diagnosisForSite = billingsForSite.map(
          ({ diagnosis_name }) => diagnosis_name.diagnosis
        );
        const top10DiagnosisForSite = topKFrequent(diagnosisForSite, 10);
        totalsBySite = [...totalsBySite, top10DiagnosisForSite];
      } else {
        totalsBySite = [...totalsBySite, {}];
      }
    }
    console.log("totalsBySite", totalsBySite);
    setTop10Diagnosis(totalsBySite);
  }, [billings, sites]);
  return { top10Diagnosis };
};

export default useTop10Diagnosis;
