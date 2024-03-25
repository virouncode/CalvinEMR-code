import { useCallback, useEffect, useState } from "react";
import xanoGet from "../api/xanoCRUD/xanoGet";
import {
  getEndOfTheMonthTZ,
  getLimitTimestampForAge,
  getStartOfTheMonthTZ,
} from "../utils/formatDates";

const useFetchDashboard = () => {
  const [sites, setSites] = useState([]);
  const [errSites, setErrSites] = useState("");
  const [loadingSites, setLoadingSites] = useState(true);

  const [patientsPerGender, setPatientsPerGender] = useState([]);
  const [errPatientsPerGender, setErrPatientsPerGender] = useState("");
  const [loadingPatientsPerGender, setLoadingPatientsPerGender] =
    useState(false);

  const [patientsPerAge, setPatientsPerAge] = useState([]);
  const [errPatientsPerAge, setErrPatientsPerAge] = useState("");
  const [loadingPatientsPerAge, setLoadingPatientsPerAge] = useState(true);

  const [visits, setVisits] = useState([]);
  const [rangeStartVisits, setRangeStartVisits] = useState(
    getStartOfTheMonthTZ()
  );
  const [rangeEndVisits, setRangeEndVisits] = useState(getEndOfTheMonthTZ());
  const [errVisits, setErrVisits] = useState("");
  const [loadingVisits, setLoadingVisits] = useState(true);

  const [billings, setBillings] = useState([]);
  const [rangeStartBillings, setRangeStartBillings] = useState(
    getStartOfTheMonthTZ()
  );
  const [rangeEndBillings, setRangeEndBillings] = useState(
    getEndOfTheMonthTZ()
  );
  const [errBillings, setErrBillings] = useState("");
  const [loadingBillings, setLoadingBillings] = useState(true);

  const [medications, setMedications] = useState();
  const [rangeStartMeds, setRangeStartMeds] = useState(getStartOfTheMonthTZ());
  const [rangeEndMeds, setRangeEndMeds] = useState(getEndOfTheMonthTZ());
  const [errMeds, setErrMeds] = useState("");
  const [loadingMeds, setLoadingMeds] = useState(true);

  const fetchSites = useCallback(async (abortController) => {
    try {
      setLoadingSites(true);
      const response = await xanoGet(`/sites`, "admin", null, abortController);
      if (abortController.signal.aborted) return;
      setSites(response.data);
      setLoadingSites(false);
    } catch (err) {
      setLoadingSites(false);
      setErrSites(`Unable to fetch sites:${err.message}`);
    }
  }, []);

  const fetchPatientsPerGender = useCallback(
    async (abortController) => {
      try {
        setLoadingPatientsPerGender(true);
        const genders = ["M", "F", "O"];
        let totals = [];
        for (const site of sites) {
          let totalsForSite = {};
          for (let i = 0; i < genders.length; i++) {
            const response = await xanoGet(
              "/dashboard/patients_gender_site",
              "admin",
              { site_id: site.id, gender: genders[i] },
              abortController
            );
            totalsForSite[genders[i]] = response.data;
          }
          totals = [...totals, totalsForSite];
        }
        const totalMale = totals.reduce((acc, current) => {
          return acc + current["M"];
        }, 0);
        const totalFemale = totals.reduce((acc, current) => {
          return acc + current["F"];
        }, 0);
        const totalOther = totals.reduce((acc, current) => {
          return acc + current["O"];
        }, 0);
        if (abortController.signal.aborted) return;
        setPatientsPerGender([
          ...totals,
          { M: totalMale, F: totalFemale, O: totalOther },
        ]);
        setLoadingPatientsPerGender(false);
      } catch (err) {
        setErrPatientsPerGender(
          `Unable to fetch patients per gender : ${err.message}`
        );
        setLoadingPatientsPerGender(false);
      }
    },
    [sites]
  );
  const fetchPatientsPerAge = useCallback(
    async (abortController) => {
      try {
        setLoadingPatientsPerAge(true);
        let totals = [];
        for (const site of sites) {
          let totalsForSite = {};
          //<18
          totalsForSite.under18 = (
            await xanoGet("/dashboard/patients_under_age_site", "admin", {
              site_id: site.id,
              dob_limit: getLimitTimestampForAge(18),
            })
          ).data;
          //18-35
          totalsForSite.from18to35 = (
            await xanoGet("/dashboard/patients_age_range_site", "admin", {
              site_id: site.id,
              dob_start: getLimitTimestampForAge(35),
              dob_end: getLimitTimestampForAge(18),
            })
          ).data;
          //36-50
          totalsForSite.from36to50 = (
            await xanoGet("/dashboard/patients_age_range_site", "admin", {
              site_id: site.id,
              dob_start: getLimitTimestampForAge(50),
              dob_end: getLimitTimestampForAge(36),
            })
          ).data;
          //51-70
          totalsForSite.from51to70 = (
            await xanoGet("/dashboard/patients_age_range_site", "admin", {
              site_id: site.id,
              dob_start: getLimitTimestampForAge(70),
              dob_end: getLimitTimestampForAge(51),
            })
          ).data;
          //>70
          totalsForSite.over70 = (
            await xanoGet("/dashboard/patients_over_age_site", "admin", {
              site_id: site.id,
              dob_limit: getLimitTimestampForAge(70),
            })
          ).data;
          totals = [...totals, totalsForSite];
        }
        totals = [
          ...totals,
          {
            under18: totals.reduce((acc, current) => {
              return acc + current.under18;
            }, 0),
            from18to35: totals.reduce((acc, current) => {
              return acc + current.from18to35;
            }, 0),
            from36to50: totals.reduce((acc, current) => {
              return acc + current.from36to50;
            }, 0),
            from51to70: totals.reduce((acc, current) => {
              return acc + current.from51to70;
            }, 0),
            over70: totals.reduce((acc, current) => {
              return acc + current.over70;
            }, 0),
          },
        ];
        if (abortController.signal.aborted) return;
        setPatientsPerAge(totals);
        setLoadingPatientsPerAge(false);
      } catch (err) {
        setErrPatientsPerAge(
          `Unable to fetch patients per age: ${err.message}`
        );
        setLoadingPatientsPerAge(false);
      }
    },
    [sites]
  );
  const fetchDatas = useCallback(
    async (
      rangeStart,
      rangeEnd,
      setDatas,
      setLoading,
      setErr,
      endpoint,
      abortController
    ) => {
      try {
        setLoading(true);
        const response = await xanoGet(
          `/dashboard/${endpoint}`,
          "admin",
          {
            range_start: rangeStart,
            range_end: rangeEnd,
          },
          abortController
        );
        if (abortController.signal.aborted) return;
        setDatas(response.data);
        setLoading(false);
        console.log(endpoint, response.data);
      } catch (err) {
        setErr(`Unable to fetch datas: ${err.message}`);
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const abortController = new AbortController();
    fetchSites(abortController);
  }, [fetchSites]);

  useEffect(() => {
    if (!sites || sites?.length === 0) return;
    const abortController = new AbortController();
    const fetchDashboard = async () => {
      await fetchDatas(
        rangeStartVisits,
        rangeEndVisits,
        setVisits,
        setLoadingVisits,
        setErrVisits,
        "visits_in_range",
        abortController
      );
      await fetchPatientsPerGender(abortController);
      await fetchPatientsPerAge(abortController);
      await fetchDatas(
        rangeStartBillings,
        rangeEndBillings,
        setBillings,
        setLoadingBillings,
        setErrBillings,
        "billings_in_range",
        abortController
      );
      await fetchDatas(
        rangeStartMeds,
        rangeEndMeds,
        setMedications,
        setLoadingMeds,
        setErrMeds,
        "medications_in_range",
        abortController
      );
    };
    fetchDashboard();
    return () => abortController.abort();
  }, [
    fetchDatas,
    fetchPatientsPerAge,
    fetchPatientsPerGender,
    rangeEndBillings,
    rangeEndMeds,
    rangeEndVisits,
    rangeStartBillings,
    rangeStartMeds,
    rangeStartVisits,
    sites,
  ]);

  return {
    visits,
    rangeStartVisits,
    setRangeStartVisits,
    rangeEndVisits,
    setRangeEndVisits,
    loadingVisits,
    errVisits,
    billings,
    setBillings,
    rangeStartBillings,
    setRangeStartBillings,
    rangeEndBillings,
    setRangeEndBillings,
    loadingBillings,
    setLoadingBillings,
    errBillings,
    setErrBillings,
    sites,
    loadingSites,
    errSites,
    patientsPerGender,
    loadingPatientsPerGender,
    errPatientsPerGender,
    patientsPerAge,
    loadingPatientsPerAge,
    errPatientsPerAge,
    medications,
    rangeStartMeds,
    setRangeStartMeds,
    rangeEndMeds,
    setRangeEndMeds,
    loadingMeds,
    errMeds,
  };
};

export default useFetchDashboard;
