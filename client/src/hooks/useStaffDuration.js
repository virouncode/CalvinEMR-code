import { useEffect, useState } from "react";
import { nowTZTimestamp } from "../utils/dates/formatDates";
import useStaffInfosContext from "./context/useStaffInfosContext";

const useStaffDuration = (sites) => {
  const { staffInfos } = useStaffInfosContext();
  const [staffDuration, setStaffDuration] = useState(null);

  useEffect(() => {
    if (!sites || sites?.length === 0) return;
    let totalsBySite = [];
    const nowMs = nowTZTimestamp();
    for (const site of sites) {
      const staffInfosForSite = staffInfos.filter(
        (staff) =>
          staff.site_id === site.id && staff.account_status === "Active"
      );
      const durations = staffInfosForSite.map(({ date_created }) =>
        Math.floor((nowMs - date_created) / (24 * 60 * 60 * 1000))
      );
      let totalsOfSite = {};
      if (durations.length) {
        totalsOfSite = {
          shortest: Math.min(...durations),
          longest: Math.max(...durations),
        };
      }
      totalsBySite = [...totalsBySite, totalsOfSite];
    }
    const shortests = totalsBySite
      .filter(({ shortest }) => shortest)
      .map(({ shortest }) => shortest);
    const longests = totalsBySite
      .filter(({ longest }) => longest)
      .map(({ longest }) => longest);

    setStaffDuration([
      ...totalsBySite,
      { shortest: Math.min(...shortests), longest: Math.max(...longests) },
    ]);
  }, [sites, staffInfos]);
  return { staffDuration };
};

export default useStaffDuration;
