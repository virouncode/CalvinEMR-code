import { useEffect, useState } from "react";
import { categoryToTitle } from "../utils/names/categoryToTitle";
import useStaffInfosContext from "./context/useStaffInfosContext";

const useStaffPerCategory = (sites) => {
  const { staffInfos } = useStaffInfosContext();
  const [staffPerCategory, setStaffPerCategory] = useState(null);
  useEffect(() => {
    if (!sites || sites?.length === 0) return;
    const categories = [
      "Doctors",
      "Medical students",
      "Nurses",
      "Nursing students",
      "Secretaries",
      "Ultra sound techs",
      "Lab techs",
      "Nutritionists",
      "Physiotherapists",
      "Psychologists",
      "Others",
    ];
    let totalsBySite = [];
    for (const site of sites) {
      const staffInfosForSite = staffInfos.filter(
        (staff) =>
          staff.site_id === site.id && staff.account_status === "Active"
      );
      const totalsOfSite = {};
      for (let i = 0; i < categories.length; i++) {
        totalsOfSite[categories[i]] = staffInfosForSite.filter(
          ({ title }) => title === categoryToTitle(categories[i])
        ).length;
      }
      totalsBySite = [...totalsBySite, totalsOfSite];
    }
    const totals = {};
    for (let i = 0; i < categories.length; i++) {
      totals[categories[i]] = totalsBySite.reduce((acc, current) => {
        return acc + current[categories[i]];
      }, 0);
    }
    setStaffPerCategory([...totalsBySite, totals]);
  }, [sites, staffInfos]);
  return { staffPerCategory };
};

export default useStaffPerCategory;
