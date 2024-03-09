import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import xanoGet from "../api/xanoCRUD/xanoGet";
import useUserContext from "./useUserContext";

const usePatientsList = (search, paging) => {
  const { user } = useUserContext();
  const [patientsDemographics, setPatientsDemographics] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const userType = user.access_level === "Admin" ? "admin" : "staff";

  useEffect(() => {
    setPatientsDemographics([]);
  }, [search]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchPatientsDemographics = async () => {
      try {
        setLoading(true);
        setErr(false);
        const response = await xanoGet(
          "/demographics_simple_search",
          userType,
          {
            paging,
            search,
          },
          abortController
        );
        //Because we can't filter those things in Xano
        if (abortController.signal.aborted) return;
        setPatientsDemographics((prevDatas) => [
          ...prevDatas,
          ...response.data.items,
        ]);
        setHasMore(response.data.items.length > 0);
        setLoading(false);
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error(
            `Error: unable to get patients demographics: ${err.message}`,
            {
              containerId: "A",
            }
          );
          setErr(true);
        }
        setLoading(false);
      }
    };
    fetchPatientsDemographics();
    return () => abortController.abort();
  }, [paging, search, userType]);

  return {
    loading,
    err,
    patientsDemographics,
    setPatientsDemographics,
    hasMore,
  };
};

export default usePatientsList;
