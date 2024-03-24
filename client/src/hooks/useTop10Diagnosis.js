import { useEffect, useState } from "react";
import { topKFrequent } from "../utils/topKFrequent";

const useTop10Diagnosis = (billings, sites, siteSelectedId) => {
  const [top10Diagnosis, setTop10Diagnosis] = useState([]);

  useEffect(() => {
    if (!sites || sites?.length === 0 || !billings || billings?.length === 0)
      return;
    let top10DiagnosisForSite = [];

    const billingsForSite = billings.filter(
      ({ site_id }) => site_id === siteSelectedId
    );
    if (billingsForSite.length > 0) {
      const diagnosisForSite = billingsForSite.map(
        ({ diagnosis_name }) => diagnosis_name.diagnosis
      );
      top10DiagnosisForSite = topKFrequent(diagnosisForSite, 10, "diagnosis");
    } else {
      top10DiagnosisForSite = [];
    }
    setTop10Diagnosis(top10DiagnosisForSite);
  }, [billings, siteSelectedId, sites]);
  return { top10Diagnosis };
};

export default useTop10Diagnosis;
